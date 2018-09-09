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
	topOffset : 20,		// Y offset to first strip (should = stripGap, so technically redundant)
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_idb_keyval__ = __webpack_require__(12);


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
	this.exonsLoaded = false;
	this.exons = [];
	this.transcripts = [];
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__QueryManager__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ListManager__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ListEditor__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__FacetManager__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__BTManager__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__GenomeView__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__FeatureDetails__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ZoomView__ = __webpack_require__(24);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__FeaturePacker__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__KeyStore__ = __webpack_require__(3);





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
	this.fStore = new __WEBPACK_IMPORTED_MODULE_3__KeyStore__["a" /* KeyStore */]('features'); // maps genome name -> list of features
    }
 
    //----------------------------------------------
    processFeature (genome, d) {
	// If we've already got this one in the cache, return it.
	let f = this.id2feat[d.ID];
	if (f) return f;
	// Create a new Feature
	f = new __WEBPACK_IMPORTED_MODULE_1__Feature__["a" /* Feature */](d);
	f.genome = genome
	// index from transcript ID -> transcript
	f.tindex = {};
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
	let exon = {
	    ID: e.primaryIdentifier,
	    transcriptIDs: e.transcripts.map(t => t.primaryIdentifier),
	    chr: e.chromosome.primaryIdentifier,
	    start: e.chromosomeLocation.start,
	    end:   e.chromosomeLocation.end,
	    feature: feat
	};
	exon.transcriptIDs.forEach( tid => {
	    let t = feat.tindex[tid];
	    if (!t) {
	        t = { ID: tid, feature: feat, exons: [], start: Infinity, end: 0 };
		feat.transcripts.push(t);
		feat.tindex[tid] = t;
	    }
	    t.exons.push(exon);
	    t.start = Math.min(t.start, exon.start);
	    t.end = Math.max(t.end, exon.end);
	});
	feat.exons.push(exon);
    }

    //----------------------------------------------
    // Processes the "raw" features returned by the server.
    // Turns them into Feature objects and registers them.
    // If the same raw feature is registered again,
    // the Feature object created the first time is returned.
    // (I.e., registering the same feature multiple times is ok)
    //
    processFeatures (genome, feats) {
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
		return Object(__WEBPACK_IMPORTED_MODULE_0__utils__["d" /* d3tsv */])(url).then( rawfeats => {
		    rawfeats.sort( (a,b) => {
			if (a.chr < b.chr)
			    return -1;
			else if (a.chr > b.chr)
			    return 1;
			else
			    return a.start - b.start;
		    });
		    this.fStore.set(genome.name, rawfeats);
		    let feats = this.processFeatures(genome, rawfeats);
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
	    if (! f || f.exonsLoaded)
	        return false;
	    f.exonsLoaded = true;
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
/* unused harmony export FeaturePacker */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);


// Given a set of rectangles where each rectangle's x coordinates and height are
// fixed, assigns y coordinates so that the rectangles do not overlap.
// Uses screen coordinates, ie, up is -y. 
// Packs rectangles on a horizontal baseline at y=0.
// Any rectangle without a height is arbitrarily assigned a height of 1.
//
// Usage:
//     new FeaturePacker().pack(myRectangles, 10, true);
//
class FeaturePacker {
    constructor () {
        this.buffer = null;
	this.ygap = 0; // min distance between rectangles in the y dimension
    }
    assignNext (f) {
	f.height = f.height || 1;
	let minGap = f.height + 2*this.ygap;
	let y = 0;
	let i = 0;
	// remove anything that does not overlap the new feature
        this.buffer = this.buffer.filter(ff => Object(__WEBPACK_IMPORTED_MODULE_0__utils__["i" /* overlaps */])(ff, f));
	// Look for a big enough gap in the y dimension between existing blocks
	// to fit this new one. If none found, stack on top.
	// Buffer is maintained in reverse y sort order.
	for (let ff in this.buffer) {
	    let gapSize = y - (ff.y + ff.height);
	    if (gapSize >= minGap) {
		break;
	    }
	    y = ff.y;
	    i += 1;
	};
	f.y = y - f.height - this.ygap;
	this.buffer.splice(i,0,f);
    }
    // Packs features by assigning y coordinates.
    pack (feats, ygap, sort) {
        this.buffer = [];
	this.ygap = ygap || 0;
        if (sort) feats.sort((a,b) => a.start - b.start);
	feats.forEach(f => this.assignNext(f));
	this.buffer = null;
    }
}




/***/ }),
/* 12 */
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
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QueryManager; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__AuxDataManager__ = __webpack_require__(14);





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
/* 14 */
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
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListManager; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ListFormulaEvaluator__ = __webpack_require__(16);
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
/* 16 */
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
/* 17 */
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
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FacetManager; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Facet__ = __webpack_require__(19);


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
/* 19 */
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
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BTManager; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__BlockTranslator__ = __webpack_require__(21);
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
/* 21 */
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
/* 22 */
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
	    this.setGeom({ height: this.totalChrWidth, rotation: -90, translation: [-this.totalChrWidth/2+10,30] });
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
/* 23 */
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
/* 24 */
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
	// 
        this.floatingText = this.svgMain.append('g')
          .attr('class','floatingText');
	this.floatingText.append('rect');
	this.floatingText.append('text');
	//
        this.cxtMenu = this.root.select('[name="cxtMenu"]');
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

	// Handle key events
	d3.select(window).on('keypress', () => {
	    let e = d3.event;
	    if (e.key === 'x' || e.code === 'KeyX'){
	        this.spreadTranscripts = ! this.spreadTranscripts;
	    }
	    else if (e.key === '+' || e.code === 'Equal' && e.shiftKey) {
	        this.featHeight = this.featHeight * 1.67;
	    }
	    else if (e.key === '-' || e.code === 'Minus') {
	        this.featHeight = this.featHeight / 1.67;
	    }
	})

	// 
        this.svg
	  .on('dblclick', () => {
	      let t = d3.event.target;
	      let tgt = d3.select(t);
	      let felt = t.closest('.feature');
	      if (felt) {
		  // user double clicked on a feature
		  // make it the landmark
		  let f = felt.__data__;
		  this.app.setContext({landmark:f.id, ref:f.genome.name, delta: 0});
	      }
	  })
	  .on('click', () => {
	      let t = d3.event.target;
	      let tgt = d3.select(t);
	      if (this.dealWithUnwantedClickEvent) {
	          this.dealWithUnwantedClickEvent = false;
		  return;
	      }
	      let felt = t.closest('.feature');
	      if (felt) {
		  // user clicked on a feature
		  fClickHandler(felt.__data__, d3.event);
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
	        window.clearTimeout(self.timeout);
	    }
	    self.timeout = window.setTimeout(() => {
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
    get featHeight () {
        return this.cfg.featHeight;
    }
    set featHeight (h) {
	let r = this.cfg.laneGap / this.cfg.featHeight;
        this.cfg.featHeight = h;
	this.cfg.laneGap = r * h;
	this.cfg.laneHeight = this.cfg.featHeight + this.cfg.laneGap;
	this.cfg.blockHeight = this.cfg.laneHeight * this.cfg.minLanes * 2;
	this.update();
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
    get stripGap () {
        return this.cfg.stripGap;
    }
    set stripGap (g) {
        this.cfg.stripGap = g;
	this.cfg.topOffset = g;
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
	this.floatingText.select('text')
	    .text(text)
	    .style('text-anchor',anchor)
	    .attr('x', x)
	    .attr('y', y)
    }
    hideFloatingText () {
	this.floatingText.select('text').text('');
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
	if (this.clearAll) {
	    // if we are changing between detailed and simple features, have to delete existing rendered features first
	    // because the structures are incompatible. Ugh. 
	    sblocks.selectAll('.feature').remove();
	}
	// ok, now that's taken care of...
        let self = this;
	//
	// never draw the same feature twice in one rendering pass
	// Can happen in complex sblocks where the relationship in not 1:1
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
	    newFeats.append('g')
	        .attr('class','transcripts')
		.attr('transform','translate(0,0)')
		;
	}
	else {
	    // simplest style: draw features as just a rectangle
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
	// Sets and returns the scene x coordinate for the given feature.
	let fx = function(f) {
	    let b = fBlock(this);
	    let x = b.xscale(Math.max(f.start,b.start))
	    f.x = x;
	    return x;
	};
	// Sets and returns the scene width for the given feature.
	let fw = function (f) {
	    let b = fBlock(this);
	    if (f.end < b.start || f.start > b.end) return 0;
	    let width = Math.abs(b.xscale(Math.min(f.end,b.end)) - b.xscale(Math.max(f.start,b.start))) + 1;
	    f.width = width;
	    return width;
	};
	// Sets and returns the scene y coordinate (px) for the given feature.
	let fy = function (f) {
	       let b = fBlock(this);
	       let y;
	       if (f.strand === '+'){
		   if (b.flip) 
		       y = self.cfg.laneHeight*f.lane - self.cfg.featHeight; 
		   else 
		       y = -self.cfg.laneHeight*f.lane;
	       }
	       else {
		   // f.lane is negative for '-' strand
		   if (b.flip) 
		       y = self.cfg.laneHeight*f.lane;
		   else
		       y = -self.cfg.laneHeight*f.lane - self.cfg.featHeight; 
	       }
	       f.y = y;
	       return y;
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
	    // draw transcripts
	    let tgrps = feats.select('g.transcripts');
	    let transcripts = tgrps.selectAll('.transcript')
	        .data( f => f.transcripts, t => t.ID )
		;
	    let newts = transcripts.enter().append('g')
	        .attr('class','transcript')
		;
	    newts.append('line');
	    newts.append('rect');
	    newts.append('g')
	        .attr('class','exons')
		;
	    transcripts.exit().remove();
	    // draw transcript axis lines
	    transcripts.select('line')
	        .attr('x1', fx)
		.attr('y1', function(t) {return fy.bind(this)(t.feature)})
		.attr('x2', function (t) { return fx.bind(this)(t) + fw.bind(this)(t) - 1 })
		.attr('y2', function(t) {return fy.bind(this)(t.feature)})
		.attr('transform',`translate(0,${this.cfg.featHeight/2})`)
		.attr('stroke', t => this.app.cscale(t.feature.getMungedType()))
		;
	    transcripts.select('rect')
		.attr('x', fx)
		.attr('y', function(t) {return fy.bind(this)(t.feature)})
		.attr('width', fw)
		.attr('height', this.cfg.featHeight)
		.style('fill', t => this.app.cscale(t.feature.getMungedType()))
		.style('fill-opacity', 0)
		;

	    let egrps = transcripts.select('g.exons');
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
	    //
	    this.spreadTranscripts = this.spreadTranscripts; 
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
		  // if showing feature details, .feature is a group with the rect as the 1st child.
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
    get spreadTranscripts () {
        return this._spreadTranscripts;
    }
    set spreadTranscripts (v) {
	let self = this;
        this._spreadTranscripts = v ? true : false;
	// translate each transcript into position
	let xps = this.svgMain.selectAll('.feature .transcripts').selectAll('.transcript');
	xps.attr('transform', (xp,i) => `translate(0,${ v ? (i * this.cfg.laneHeight * (xp.feature.strand === '-' ? 1 : -1)) : 0})`);
	// translate the feature rectangle and set its height
	let frs = this.svgMain.selectAll('.feature > rect')
	    .attr('height', (f,i) => {
		let nLanes = Math.max(1, v ? f.transcripts.length : 1);
	        return this.cfg.laneHeight * nLanes - this.cfg.laneGap;
	    })
	    .attr('transform', function (f, i) {
		let dt = d3.select(this);
		let dy = parseFloat(dt.attr('height')) - self.cfg.laneHeight + self.cfg.laneGap;
		return `translate(0,${ f.strand === '-' || !v ? 0 : -dy})`;
	    })
	    ;
	window.setTimeout( () => this.highlight(), 500 );
    }
    //----------------------------------------------
    hideFiducials () {
	this.svgMain.select('g.fiducials')
	    .classed('hidden', true);
    }
} // end class ZoomView




/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNWFhNTdhNTIwMmVhNDFkNThkYmMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL3V0aWxzLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9Db21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvS2V5U3RvcmUuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0ZlYXR1cmUuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0xpc3RGb3JtdWxhUGFyc2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9TVkdWaWV3LmpzIiwid2VicGFjazovLy8uL3d3dy9qcy92aWV3ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL01HVkFwcC5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvR2Vub21lLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9GZWF0dXJlTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvRmVhdHVyZVBhY2tlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaWRiLWtleXZhbC9kaXN0L2lkYi1rZXl2YWwubWpzIiwid2VicGFjazovLy8uL3d3dy9qcy9RdWVyeU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0F1eERhdGFNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9MaXN0TWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvTGlzdEZvcm11bGFFdmFsdWF0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0xpc3RFZGl0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0ZhY2V0TWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvRmFjZXQuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2pzL0JUTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvQmxvY2tUcmFuc2xhdG9yLmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9HZW5vbWVWaWV3LmpzIiwid2VicGFjazovLy8uL3d3dy9qcy9GZWF0dXJlRGV0YWlscy5qcyIsIndlYnBhY2s6Ly8vLi93d3cvanMvWm9vbVZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVEQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixvREFBb0Q7QUFDaEYsU0FBUztBQUNULEtBQUssRTtBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixvREFBb0Q7QUFDaEYsU0FBUztB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTs7Ozs7Ozs7OztBQzFENEM7O0FBRTVDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsb0JBQW9CO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0QsSUFBSTtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRVE7Ozs7Ozs7O0FDckRSO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSx5QkFBeUIsd0JBQXdCLEVBQUU7O0FBRW5EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQSxHQUFHO0FBQ0gsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLGtCQUFrQjtBQUN4QyxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0Esc0JBQXNCLGtCQUFrQjtBQUN4QyxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsRUFBRTtBQUNGO0FBQ0EsRUFBRSxFQUFFOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLE1BQU07QUFDTixFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsb0JBQW9CO0FBQ3JELEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELFFBQVEsVUFBVSxFQUFFLElBQUk7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3QkFBd0IscUJBQXFCO0FBQzdDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixNQUFNO0FBQy9CLGlDQUFpQyxvQkFBb0I7QUFDckQscUJBQXFCLE1BQU0sU0FBUyxRQUFRLE9BQU8sTUFBTTtBQUN6RDtBQUNBLDJCQUEyQixXQUFXLFNBQVMs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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLG9CQUFvQjtBQUNwQjtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFTzs7Ozs7Ozs7OztBQy9QVzs7QUFFbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVROzs7Ozs7Ozs7Ozs7O0FDL0NSO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNB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Q0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQsYUFBYTtBQUNsRTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFTzs7Ozs7Ozs7OztBQzdTb0I7O0FBRTVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVROzs7Ozs7Ozs7Ozs7QUNuRXFEO0FBQ3pDO0FBQ1E7O0FBRTVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0Q7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRU87Ozs7Ozs7Ozs7QUNqT1E7O0FBRWhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFTzs7Ozs7Ozs7QUM3QlI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVPOzs7Ozs7Ozs7Ozs7QUNwQlE7QUFDVTtBQUNQOztBQUVuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLE1BQU0sTUFBTSxNQUFNLGNBQWMsY0FBYztBQUNsRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLG1CQUFtQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sSUFBSTtBQUNYO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRU87Ozs7Ozs7O0FDOUdSO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0Esd0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFUTs7Ozs7Ozs7Ozs7QUNqTFU7QUFDYTs7QUFFL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsa0JBQWtCO0FBQ2xCLHNCQUFzQjtBQUN0QixzQkFBc0I7QUFDdEIsNkJBQTZCO0FBQzdCO0FBQ0E7QUFD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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVELEdBQUc7QUFDMUQ7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsa0NBQWtDO0FBQzlEO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsa0JBQWtCLEdBQUcsRUFBRSxJQUFJLEVBQUU7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0Isd0RBQXdEO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsVztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTixFQUFFO0FBQ0Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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TUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVPIiwiZmlsZSI6Im1ndi5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA3KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA1YWE1N2E1MjAyZWE0MWQ1OGRiYyIsIlxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyAgICAgICAgICAgICAgICAgICAgVVRJTFNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIChSZS0pSW5pdGlhbGl6ZXMgYW4gb3B0aW9uIGxpc3QuXG4vLyBBcmdzOlxuLy8gICBzZWxlY3RvciAoc3RyaW5nIG9yIE5vZGUpIENTUyBzZWxlY3RvciBvZiB0aGUgY29udGFpbmVyIDxzZWxlY3Q+IGVsZW1lbnQuIE9yIHRoZSBlbGVtZW50IGl0c2VsZi5cbi8vICAgb3B0cyAobGlzdCkgTGlzdCBvZiBvcHRpb24gZGF0YSBvYmplY3RzLiBNYXkgYmUgc2ltcGxlIHN0cmluZ3MuIE1heSBiZSBtb3JlIGNvbXBsZXguXG4vLyAgIHZhbHVlIChmdW5jdGlvbiBvciBudWxsKSBGdW5jdGlvbiB0byBwcm9kdWNlIHRoZSA8b3B0aW9uPiB2YWx1ZSBmcm9tIGFuIG9wdHMgaXRlbVxuLy8gICAgICAgRGVmYXVsdHMgdG8gdGhlIGlkZW50aXR5IGZ1bmN0aW9uICh4PT54KS5cbi8vICAgbGFiZWwgKGZ1bmN0aW9uIG9yIG51bGwpIEZ1bmN0aW9uIHRvIHByb2R1Y2UgdGhlIDxvcHRpb24+IGxhYmVsIGZyb20gYW4gb3B0cyBpdGVtXG4vLyAgICAgICBEZWZhdWx0cyB0byB0aGUgdmFsdWUgZnVuY3Rpb24uXG4vLyAgIG11bHRpIChib29sZWFuKSBTcGVjaWZpZXMgaWYgdGhlIGxpc3Qgc3VwcG9ydCBtdWx0aXBsZSBzZWxlY3Rpb25zLiAoZGVmYXVsdCA9IGZhbHNlKVxuLy8gICBzZWxlY3RlZCAoZnVuY3Rpb24gb3IgbnVsbCkgRnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGlmIGEgZ2l2ZW4gb3B0aW9uIGlzIHNlbGVjdGQuXG4vLyAgICAgICBEZWZhdWx0cyB0byBkPT5GYWxzZS4gTm90ZSB0aGF0IHRoaXMgZnVuY3Rpb24gaXMgb25seSBhcHBsaWVkIHRvIG5ldyBvcHRpb25zLlxuLy8gICBzb3J0QnkgKGZ1bmN0aW9uKSBPcHRpb25hbC4gSWYgcHJvdmlkZWQsIGEgY29tcGFyaXNvbiBmdW5jdGlvbiB0byB1c2UgZm9yIHNvcnRpbmcgdGhlIG9wdGlvbnMuXG4vLyAgIFx0IFRoZSBjb21wYXJpc29uIGZ1bmN0aW9uIGlzIHBhc3NlcyB0aGUgZGF0YSBvYmplY3RzIGNvcnJlc3BvbmRpbmcgdG8gdHdvIG9wdGlvbnMgYW5kIHNob3VsZFxuLy8gICBcdCByZXR1cm4gLTEsIDAgb3IgKzEuIElmIG5vdCBwcm92aWRlZCwgdGhlIG9wdGlvbiBsaXN0IHdpbGwgaGF2ZSB0aGUgc2FtZSBzb3J0IG9yZGVyIGFzIHRoZSBvcHRzIGFyZ3VtZW50LlxuLy8gUmV0dXJuczpcbi8vICAgVGhlIG9wdGlvbiBsaXN0IGluIGEgRDMgc2VsZWN0aW9uLlxuZnVuY3Rpb24gaW5pdE9wdExpc3Qoc2VsZWN0b3IsIG9wdHMsIHZhbHVlLCBsYWJlbCwgbXVsdGksIHNlbGVjdGVkLCBzb3J0QnkpIHtcblxuICAgIC8vIHNldCB1cCB0aGUgZnVuY3Rpb25zXG4gICAgbGV0IGlkZW50ID0gZCA9PiBkO1xuICAgIHZhbHVlID0gdmFsdWUgfHwgaWRlbnQ7XG4gICAgbGFiZWwgPSBsYWJlbCB8fCB2YWx1ZTtcbiAgICBzZWxlY3RlZCA9IHNlbGVjdGVkIHx8ICh4ID0+IGZhbHNlKTtcblxuICAgIC8vIHRoZSA8c2VsZWN0PiBlbHRcbiAgICBsZXQgcyA9IGQzLnNlbGVjdChzZWxlY3Rvcik7XG5cbiAgICAvLyBtdWx0aXNlbGVjdFxuICAgIHMucHJvcGVydHkoJ211bHRpcGxlJywgbXVsdGkgfHwgbnVsbCkgO1xuXG4gICAgLy8gYmluZCB0aGUgb3B0cy5cbiAgICBsZXQgb3MgPSBzLnNlbGVjdEFsbChcIm9wdGlvblwiKVxuICAgICAgICAuZGF0YShvcHRzLCBsYWJlbCk7XG4gICAgb3MuZW50ZXIoKVxuICAgICAgICAuYXBwZW5kKFwib3B0aW9uXCIpIFxuICAgICAgICAuYXR0cihcInZhbHVlXCIsIHZhbHVlKVxuICAgICAgICAucHJvcGVydHkoXCJzZWxlY3RlZFwiLCBvID0+IHNlbGVjdGVkKG8pIHx8IG51bGwpXG4gICAgICAgIC50ZXh0KGxhYmVsKSBcbiAgICAgICAgO1xuICAgIC8vXG4gICAgb3MuZXhpdCgpLnJlbW92ZSgpIDtcblxuICAgIC8vIHNvcnQgdGhlIHJlc3VsdHNcbiAgICBpZiAoIXNvcnRCeSkgc29ydEJ5ID0gKGEsYikgPT4ge1xuICAgIFx0bGV0IGFpID0gb3B0cy5pbmRleE9mKGEpO1xuXHRsZXQgYmkgPSBvcHRzLmluZGV4T2YoYik7XG5cdHJldHVybiBhaSAtIGJpO1xuICAgIH1cbiAgICBvcy5zb3J0KHNvcnRCeSk7XG5cbiAgICAvL1xuICAgIHJldHVybiBzO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByb21pc2lmaWVzIGEgY2FsbCB0byBkMy50c3YuXG4vLyBBcmdzOlxuLy8gICB1cmwgKHN0cmluZykgVGhlIHVybCBvZiB0aGUgdHN2IHJlc291cmNlXG4vLyBSZXR1cm5zOlxuLy8gICBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUgbGlzdCBvZiByb3cgb2JqZWN0c1xuZnVuY3Rpb24gZDN0c3YodXJsKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBkMy50c3YodXJsLCBmdW5jdGlvbihlcnJvciwgdmFsKXtcbiAgICAgICAgICAgIGVycm9yID8gcmVqZWN0KHsgc3RhdHVzOiBlcnJvci5zdGF0dXMsIHN0YXR1c1RleHQ6IGVycm9yLnN0YXR1c1RleHR9KSA6IHJlc29sdmUodmFsKTtcbiAgICAgICAgfSkgIFxuICAgIH0pOyBcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcm9taXNpZmllcyBhIGNhbGwgdG8gZDMuanNvbi5cbi8vIEFyZ3M6XG4vLyAgIHVybCAoc3RyaW5nKSBUaGUgdXJsIG9mIHRoZSBqc29uIHJlc291cmNlXG4vLyBSZXR1cm5zOlxuLy8gICBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUganNvbiBvYmplY3QgdmFsdWUsIG9yIHJlamVjdHMgd2l0aCBhbiBlcnJvclxuZnVuY3Rpb24gZDNqc29uKHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZDMuanNvbih1cmwsIGZ1bmN0aW9uKGVycm9yLCB2YWwpe1xuICAgICAgICAgICAgZXJyb3IgPyByZWplY3QoeyBzdGF0dXM6IGVycm9yLnN0YXR1cywgc3RhdHVzVGV4dDogZXJyb3Iuc3RhdHVzVGV4dH0pIDogcmVzb2x2ZSh2YWwpO1xuICAgICAgICB9KSAgXG4gICAgfSk7IFxufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByb21pc2lmaWVzIGEgY2FsbCB0byBkMy50ZXh0LlxuLy8gQXJnczpcbi8vICAgdXJsIChzdHJpbmcpIFRoZSB1cmwgb2YgdGhlIHRleHQgcmVzb3VyY2Vcbi8vIFJldHVybnM6XG4vLyAgIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSBqc29uIG9iamVjdCB2YWx1ZSwgb3IgcmVqZWN0cyB3aXRoIGFuIGVycm9yXG5mdW5jdGlvbiBkM3RleHQodXJsKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBkMy50ZXh0KHVybCwgJ3RleHQvcGxhaW4nLCBmdW5jdGlvbihlcnJvciwgdmFsKXtcbiAgICAgICAgICAgIGVycm9yID8gcmVqZWN0KHsgc3RhdHVzOiBlcnJvci5zdGF0dXMsIHN0YXR1c1RleHQ6IGVycm9yLnN0YXR1c1RleHR9KSA6IHJlc29sdmUodmFsKTtcbiAgICAgICAgfSkgIFxuICAgIH0pOyBcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZXR1cm5zIGEgZGVlcCBjb3B5IG9mIG9iamVjdCBvLiBcbi8vIEFyZ3M6XG4vLyAgIG8gIChvYmplY3QpIE11c3QgYmUgYSBKU09OIG9iamVjdCAobm8gY3VyY3VsYXIgcmVmcywgbm8gZnVuY3Rpb25zKS5cbi8vIFJldHVybnM6XG4vLyAgIGEgZGVlcCBjb3B5IG9mIG9cbmZ1bmN0aW9uIGRlZXBjKG8pIHtcbiAgICBpZiAoIW8pIHJldHVybiBvO1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvKSk7XG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUGFyc2VzIGEgc3RyaW5nIG9mIHRoZSBmb3JtIFwiY2hyOnN0YXJ0Li5lbmRcIi5cbi8vIFJldHVybnM6XG4vLyAgIG9iamVjdCBjb250aW5pbmcgdGhlIHBhcnNlZCBmaWVsZHMuXG4vLyBFeGFtcGxlOlxuLy8gICBwYXJzZUNvb3JkcyhcIjEwOjEwMDAwMDAwLi4yMDAwMDAwMFwiKSAtPiB7Y2hyOlwiMTBcIiwgc3RhcnQ6MTAwMDAwMDAsIGVuZDoyMDAwMDAwMH1cbmZ1bmN0aW9uIHBhcnNlQ29vcmRzIChjb29yZHMpIHtcbiAgICBsZXQgcmUgPSAvKFteOl0rKTooXFxkKylcXC5cXC4oXFxkKykvO1xuICAgIGxldCBtID0gY29vcmRzLm1hdGNoKHJlKTtcbiAgICByZXR1cm4gbSA/IHtjaHI6bVsxXSwgc3RhcnQ6cGFyc2VJbnQobVsyXSksIGVuZDpwYXJzZUludChtWzNdKX0gOiBudWxsO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEZvcm1hdHMgYSBjaHJvbW9zb21lIG5hbWUsIHN0YXJ0IGFuZCBlbmQgcG9zaXRpb24gYXMgYSBzdHJpbmcuXG4vLyBBcmdzIChmb3JtIDEpOlxuLy8gICBjb29yZHMgKG9iamVjdCkgT2YgdGhlIGZvcm0ge2NocjpzdHJpbmcsIHN0YXJ0OmludCwgZW5kOmludH1cbi8vIEFyZ3MgKGZvcm0gMik6XG4vLyAgIGNociBzdHJpbmdcbi8vICAgc3RhcnQgaW50XG4vLyAgIGVuZCBpbnRcbi8vIFJldHVybnM6XG4vLyAgICAgc3RyaW5nXG4vLyBFeGFtcGxlOlxuLy8gICAgIGZvcm1hdENvb3JkcyhcIjEwXCIsIDEwMDAwMDAwLCAyMDAwMDAwMCkgLT4gXCIxMDoxMDAwMDAwMC4uMjAwMDAwMDBcIlxuZnVuY3Rpb24gZm9ybWF0Q29vcmRzIChjaHIsIHN0YXJ0LCBlbmQpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuXHRsZXQgYyA9IGNocjtcblx0Y2hyID0gYy5jaHI7XG5cdHN0YXJ0ID0gYy5zdGFydDtcblx0ZW5kID0gYy5lbmQ7XG4gICAgfVxuICAgIHJldHVybiBgJHtjaHJ9OiR7c3RhcnR9Li4ke2VuZH1gXG59XG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJldHVybnMgdHJ1ZSBpZmYgdGhlIHR3byByYW5nZXMgb3ZlcmxhcCBieSBhdCBsZWFzdCAxLlxuLy8gRWFjaCByYW5nZSBtdXN0IGhhdmUgYSBjaHIsIHN0YXJ0LCBhbmQgZW5kLlxuLy9cbmZ1bmN0aW9uIG92ZXJsYXBzIChhLCBiKSB7XG4gICAgcmV0dXJuIGEuY2hyID09PSBiLmNociAmJiBhLnN0YXJ0IDw9IGIuZW5kICYmIGEuZW5kID49IGIuc3RhcnQ7XG59XG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEdpdmVuIHR3byByYW5nZXMsIGEgYW5kIGIsIHJldHVybnMgYSAtIGIuXG4vLyBUaGUgcmVzdWx0IGlzIGEgbGlzdCBvZiAwLCAxIG9yIDIgbmV3IHJhbmdlcywgZGVwZW5kaW5nIG9uIGEgYW5kIGIuXG5mdW5jdGlvbiBzdWJ0cmFjdChhLCBiKSB7XG4gICAgaWYgKGEuY2hyICE9PSBiLmNocikgcmV0dXJuIFsgYSBdO1xuICAgIGxldCBhYkxlZnQgPSB7IGNocjphLmNociwgc3RhcnQ6YS5zdGFydCwgICAgICAgICAgICAgICAgICAgIGVuZDpNYXRoLm1pbihhLmVuZCwgYi5zdGFydC0xKSB9O1xuICAgIGxldCBhYlJpZ2h0PSB7IGNocjphLmNociwgc3RhcnQ6TWF0aC5tYXgoYS5zdGFydCwgYi5lbmQrMSksIGVuZDphLmVuZCB9O1xuICAgIGxldCBhbnMgPSBbIGFiTGVmdCwgYWJSaWdodCBdLmZpbHRlciggciA9PiByLnN0YXJ0IDw9IHIuZW5kICk7XG4gICAgcmV0dXJuIGFucztcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBDcmVhdGVzIGEgbGlzdCBvZiBrZXksdmFsdWUgcGFpcnMgZnJvbSB0aGUgb2JqLlxuZnVuY3Rpb24gb2JqMmxpc3QgKG8pIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMobykubWFwKGsgPT4gW2ssIG9ba11dKSAgICBcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZXR1cm5zIHRydWUgaWZmIHRoZSB0d28gbGlzdHMgaGF2ZSB0aGUgc2FtZSBjb250ZW50cyAoYmFzZWQgb24gaW5kZXhPZikuXG4vLyBCcnV0ZSBmb3JjZSBhcHByb2FjaC4gQmUgY2FyZWZ1bCB3aGVyZSB5b3UgdXNlIHRoaXMuXG5mdW5jdGlvbiBzYW1lIChhbHN0LGJsc3QpIHtcbiAgIHJldHVybiBhbHN0Lmxlbmd0aCA9PT0gYmxzdC5sZW5ndGggJiYgXG4gICAgICAgYWxzdC5yZWR1Y2UoKGFjYyx4KSA9PiAoYWNjICYmIGJsc3QuaW5kZXhPZih4KT49MCksIHRydWUpO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQWRkIGJhc2ljIHNldCBvcHMgdG8gU2V0IHByb3RvdHlwZS5cbi8vIExpZnRlZCBmcm9tOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9TZXRcblNldC5wcm90b3R5cGUudW5pb24gPSBmdW5jdGlvbihzZXRCKSB7XG4gICAgdmFyIHVuaW9uID0gbmV3IFNldCh0aGlzKTtcbiAgICBmb3IgKHZhciBlbGVtIG9mIHNldEIpIHtcbiAgICAgICAgdW5pb24uYWRkKGVsZW0pO1xuICAgIH1cbiAgICByZXR1cm4gdW5pb247XG59XG5cblNldC5wcm90b3R5cGUuaW50ZXJzZWN0aW9uID0gZnVuY3Rpb24oc2V0Qikge1xuICAgIHZhciBpbnRlcnNlY3Rpb24gPSBuZXcgU2V0KCk7XG4gICAgZm9yICh2YXIgZWxlbSBvZiBzZXRCKSB7XG4gICAgICAgIGlmICh0aGlzLmhhcyhlbGVtKSkge1xuICAgICAgICAgICAgaW50ZXJzZWN0aW9uLmFkZChlbGVtKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaW50ZXJzZWN0aW9uO1xufVxuXG5TZXQucHJvdG90eXBlLmRpZmZlcmVuY2UgPSBmdW5jdGlvbihzZXRCKSB7XG4gICAgdmFyIGRpZmZlcmVuY2UgPSBuZXcgU2V0KHRoaXMpO1xuICAgIGZvciAodmFyIGVsZW0gb2Ygc2V0Qikge1xuICAgICAgICBkaWZmZXJlbmNlLmRlbGV0ZShlbGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIGRpZmZlcmVuY2U7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIGdldENhcmV0UmFuZ2UgKGVsdCkge1xuICAgIC8vIEZJWE1FOiBkb2VzIG5vdCB3b3JrIGZvciBJRVxuICAgIHJldHVybiBbZWx0LnNlbGVjdGlvblN0YXJ0LCBlbHQuc2VsZWN0aW9uRW5kXTtcbn1cbmZ1bmN0aW9uIHNldENhcmV0UmFuZ2UgKGVsdCwgcmFuZ2UpIHtcbiAgICAvLyBGSVhNRTogZG9lcyBub3Qgd29yayBmb3IgSUVcbiAgICBlbHQuc2VsZWN0aW9uU3RhcnQgPSByYW5nZVswXTtcbiAgICBlbHQuc2VsZWN0aW9uRW5kICAgPSByYW5nZVsxXTtcbn1cbmZ1bmN0aW9uIHNldENhcmV0UG9zaXRpb24gKGVsdCwgcG9zKSB7XG4gICAgc2V0Q2FyZXRSYW5nZShlbHQsIFtwb3MscG9zXSk7XG59XG5mdW5jdGlvbiBtb3ZlQ2FyZXRQb3NpdGlvbiAoZWx0LCBkZWx0YSkge1xuICAgIHNldENhcmV0UG9zaXRpb24oZWx0LCBnZXRDYXJldFBvc2l0aW9uKGVsdCkgKyBkZWx0YSk7XG59XG5mdW5jdGlvbiBnZXRDYXJldFBvc2l0aW9uIChlbHQpIHtcbiAgICBsZXQgciA9IGdldENhcmV0UmFuZ2UoZWx0KTtcbiAgICByZXR1cm4gclsxXTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZXR1cm5zIHRoZSBzY3JlZW4gY29vcmRpbmF0ZXMgb2YgYW4gU1ZHIHNoYXBlIChjaXJjbGUsIHJlY3QsIHBvbHlnb24sIGxpbmUpXG4vLyBhZnRlciBhbGwgdHJhbnNmb3JtcyBoYXZlIGJlZW4gYXBwbGllZC5cbi8vXG4vLyBBcmdzOlxuLy8gICAgIHNoYXBlIChub2RlKSBUaGUgU1ZHIHNoYXBlLlxuLy9cbi8vIFJldHVybnM6XG4vLyAgICAgVGhlIGZvcm0gb2YgdGhlIHJldHVybmVkIHZhbHVlIGRlcGVuZHMgb24gdGhlIHNoYXBlLlxuLy8gICAgIGNpcmNsZTogIHsgY3gsIGN5LCByIH1cbi8vICAgICAgICAgcmV0dXJucyB0aGUgdHJhbnNmb3JtZWQgY2VudGVyIHBvaW50IGFuZCB0cmFuc2Zvcm1lZCByYWRpdXMgICAgICAgICBcbi8vICAgICBsaW5lOlx0eyB4MSwgeTEsIHgyLCB5MiB9XG4vLyAgICAgICAgIHJldHVybnMgdGhlIHRyYW5zZm9ybWVkIGVuZHBvaW50c1xuLy8gICAgIHJlY3Q6XHR7IHgsIHksIHdpZHRoLCBoZWlnaHQgfVxuLy8gICAgICAgICByZXR1cm5zIHRoZSB0cmFuc2Zvcm1lZCBjb3JuZXIgcG9pbnQgYW5kIHRyYW5zZm9ybWVkIHdpZHRoK2hlaWdodC5cbi8vICAgICBwb2x5Z29uOiBbIHt4LHl9LCB7eCx5fSAsIC4uLiBdXG4vLyAgICAgICAgIHJldHVybnMgdGhlIHRyYW5zZm9ybWVkIGxpc3Qgb2YgcG9pbnRzXG4vL1xuLy8gQWRhcHRlZCBmcm9tOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy82ODU4NDc5L3JlY3RhbmdsZS1jb29yZGluYXRlcy1hZnRlci10cmFuc2Zvcm0/cnE9MVxuLy9cbmZ1bmN0aW9uIGNvb3Jkc0FmdGVyVHJhbnNmb3JtIChzaGFwZSkge1xuICAgIC8vXG4gICAgbGV0IGRzaGFwZSA9IGQzLnNlbGVjdChzaGFwZSk7XG4gICAgbGV0IHN2ZyA9IHNoYXBlLmNsb3Nlc3QoXCJzdmdcIik7XG4gICAgaWYgKCFzdmcpIHJldHVybiBudWxsO1xuICAgIGxldCBzdHlwZSA9IHNoYXBlLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgICBsZXQgbWF0cml4ID0gc2hhcGUuZ2V0Q1RNKCk7XG4gICAgbGV0IHAgPSBzdmcuY3JlYXRlU1ZHUG9pbnQoKTtcbiAgICBsZXQgcDI9IHN2Zy5jcmVhdGVTVkdQb2ludCgpO1xuICAgIC8vXG4gICAgc3dpdGNoIChzdHlwZSkge1xuICAgIC8vXG4gICAgY2FzZSAnY2lyY2xlJzpcblx0cC54ICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJjeFwiKSk7XG5cdHAueSAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwiY3lcIikpO1xuXHRwMi54ID0gcC54ICsgcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcInJcIikpO1xuXHRwMi55ID0gcC55O1xuXHRwICAgID0gcC5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcblx0cDIgICA9IHAyLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuXHQvLyBjYWxjIG5ldyByYWRpdXMgYXMgZGlzdGFuY2UgYmV0d2VlbiB0cmFuc2Zvcm1lZCBwb2ludHNcblx0bGV0IGR4ID0gTWF0aC5hYnMocC54IC0gcDIueCk7XG5cdGxldCBkeSA9IE1hdGguYWJzKHAueSAtIHAyLnkpO1xuXHRsZXQgciA9IE1hdGguc3FydChkeCpkeCArIGR5KmR5KTtcbiAgICAgICAgcmV0dXJuIHsgY3g6IHAueCwgY3k6IHAueSwgcjpyIH07XG4gICAgLy9cbiAgICBjYXNlICdyZWN0Jzpcblx0Ly8gRklYTUU6IGRvZXMgbm90IGhhbmRsZSByb3RhdGlvbnMgY29ycmVjdGx5LiBUbyBmaXgsIHRyYW5zbGF0ZSBjb3JuZXIgcG9pbnRzIHNlcGFyYXRlbHkgYW5kIHRoZW5cblx0Ly8gY2FsY3VsYXRlIHRoZSB0cmFuc2Zvcm1lZCB3aWR0aCBhbmQgaGVpZ2h0LiBBcyBhIGNvbnZlbmllbmNlIHRvIHRoZSB1c2VyLCBtaWdodCBiZSBuaWNlIHRvIHJldHVyblxuXHQvLyB0aGUgdHJhbnNmb3JtZWQgY29ybmVyIHBvaW50cyBhbmQgcG9zc2libHkgdGhlIGZpbmFsIGFuZ2xlIG9mIHJvdGF0aW9uLlxuXHRwLnggID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcInhcIikpO1xuXHRwLnkgID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcInlcIikpO1xuXHRwMi54ID0gcC54ICsgcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcIndpZHRoXCIpKTtcblx0cDIueSA9IHAueSArIHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJoZWlnaHRcIikpO1xuXHQvL1xuXHRwICA9IHAubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG5cdHAyID0gcDIubWF0cml4VHJhbnNmb3JtKG1hdHJpeCk7XG5cdC8vXG4gICAgICAgIHJldHVybiB7IHg6IHAueCwgeTogcC55LCB3aWR0aDogcDIueC1wLngsIGhlaWdodDogcDIueS1wLnkgfTtcbiAgICAvL1xuICAgIGNhc2UgJ3BvbHlnb24nOlxuICAgICAgICBsZXQgcHRzID0gZHNoYXBlLmF0dHIoXCJwb2ludHNcIikudHJpbSgpLnNwbGl0KC8gKy8pO1xuXHRyZXR1cm4gcHRzLm1hcCggcHQgPT4ge1xuXHQgICAgbGV0IHh5ID0gcHQuc3BsaXQoXCIsXCIpO1xuXHQgICAgcC54ID0gcGFyc2VGbG9hdCh4eVswXSlcblx0ICAgIHAueSA9IHBhcnNlRmxvYXQoeHlbMV0pXG5cdCAgICBwID0gcC5tYXRyaXhUcmFuc2Zvcm0obWF0cml4KTtcblx0ICAgIHJldHVybiB7IHg6IHAueCwgeTogcC55IH07XG5cdH0pO1xuICAgIC8vXG4gICAgY2FzZSAnbGluZSc6XG5cdHAueCAgID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcIngxXCIpKTtcblx0cC55ICAgPSBwYXJzZUZsb2F0KGRzaGFwZS5hdHRyKFwieTFcIikpO1xuXHRwMi54ICA9IHBhcnNlRmxvYXQoZHNoYXBlLmF0dHIoXCJ4MlwiKSk7XG5cdHAyLnkgID0gcGFyc2VGbG9hdChkc2hhcGUuYXR0cihcInkyXCIpKTtcblx0cCAgICAgPSBwLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuXHRwMiAgICA9IHAyLm1hdHJpeFRyYW5zZm9ybShtYXRyaXgpO1xuICAgICAgICByZXR1cm4geyB4MTogcC54LCB5MTogcC55LCB4MjogcDIueCwgeDI6IHAyLnkgfTtcbiAgICAvL1xuICAgIC8vIEZJWE1FOiBhZGQgY2FzZSAndGV4dCdcbiAgICAvL1xuXG4gICAgZGVmYXVsdDpcblx0dGhyb3cgXCJVbnN1cHBvcnRlZCBub2RlIHR5cGU6IFwiICsgc3R5cGU7XG4gICAgfVxuXG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmVtb3ZlcyBkdXBsaWNhdGVzIGZyb20gYSBsaXN0IHdoaWxlIHByZXNlcnZpbmcgbGlzdCBvcmRlci5cbi8vIEFyZ3M6XG4vLyAgICAgbHN0IChsaXN0KVxuLy8gUmV0dXJuczpcbi8vICAgICBBIHByb2Nlc3NlZCBjb3B5IG9mIGxzdCBpbiB3aGljaCBhbnkgZHVwcyBoYXZlIGJlZW4gcmVtb3ZlZC5cbmZ1bmN0aW9uIHJlbW92ZUR1cHMgKGxzdCkge1xuICAgIGxldCBsc3QyID0gW107XG4gICAgbGV0IHNlZW4gPSBuZXcgU2V0KCk7XG4gICAgbHN0LmZvckVhY2goeCA9PiB7XG5cdC8vIHJlbW92ZSBkdXBzIHdoaWxlIHByZXNlcnZpbmcgb3JkZXJcblx0aWYgKHNlZW4uaGFzKHgpKSByZXR1cm47XG5cdGxzdDIucHVzaCh4KTtcblx0c2Vlbi5hZGQoeCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGxzdDI7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQ2xpcHMgYSB2YWx1ZSB0byBhIHJhbmdlLlxuZnVuY3Rpb24gY2xpcCAobiwgbWluLCBtYXgpIHtcbiAgICByZXR1cm4gTWF0aC5taW4obWF4LCBNYXRoLm1heChtaW4sIG4pKTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZXR1cm5zIHRoZSBnaXZlbiBiYXNlcGFpciBhbW91bnQgXCJwcmV0dHkgcHJpbnRlZFwiIHRvIGFuIGFwcG9ycHJpYXRlIHNjYWxlLCBwcmVjaXNpb24sIGFuZCB1bml0cy5cbi8vIEVnLCAgXG4vLyAgICAxMjcgPT4gJzEyNyBicCdcbi8vICAgIDEyMzQ1Njc4OSA9PiAnMTIzLjUgTWInXG5mdW5jdGlvbiBwcmV0dHlQcmludEJhc2VzIChuKSB7XG4gICAgbGV0IGFic24gPSBNYXRoLmFicyhuKTtcbiAgICBpZiAoYWJzbiA8IDEwMDApIHtcbiAgICAgICAgcmV0dXJuIGAke259IGJwYDtcbiAgICB9XG4gICAgaWYgKGFic24gPj0gMTAwMCAmJiBhYnNuIDwgMTAwMDAwMCkge1xuICAgICAgICByZXR1cm4gYCR7KG4vMTAwMCkudG9GaXhlZCgyKX0ga2JgO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGAkeyhuLzEwMDAwMDApLnRvRml4ZWQoMil9IE1iYDtcbiAgICB9XG4gICAgcmV0dXJuIFxufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCB7XG4gICAgaW5pdE9wdExpc3QsXG4gICAgZDN0c3YsXG4gICAgZDNqc29uLFxuICAgIGQzdGV4dCxcbiAgICBkZWVwYyxcbiAgICBwYXJzZUNvb3JkcyxcbiAgICBmb3JtYXRDb29yZHMsXG4gICAgb3ZlcmxhcHMsXG4gICAgc3VidHJhY3QsXG4gICAgb2JqMmxpc3QsXG4gICAgc2FtZSxcbiAgICBnZXRDYXJldFJhbmdlLFxuICAgIHNldENhcmV0UmFuZ2UsXG4gICAgc2V0Q2FyZXRQb3NpdGlvbixcbiAgICBtb3ZlQ2FyZXRQb3NpdGlvbixcbiAgICBnZXRDYXJldFBvc2l0aW9uLFxuICAgIGNvb3Jkc0FmdGVyVHJhbnNmb3JtLFxuICAgIHJlbW92ZUR1cHMsXG4gICAgY2xpcCxcbiAgICBwcmV0dHlQcmludEJhc2VzXG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvdXRpbHMuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBDb21wb25lbnQge1xuICAgIC8vIGFwcCAtIHRoZSBvd25pbmcgYXBwIG9iamVjdFxuICAgIC8vIGVsdCAtIGNvbnRhaW5lci4gbWF5IGJlIGEgc3RyaW5nIChzZWxlY3RvciksIGEgRE9NIG5vZGUsIG9yIGEgZDMgc2VsZWN0aW9uIG9mIDEgbm9kZS5cbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQpIHtcblx0dGhpcy5hcHAgPSBhcHBcblx0aWYgKHR5cGVvZihlbHQpID09PSBcInN0cmluZ1wiKVxuXHQgICAgLy8gZWx0IGlzIGEgQ1NTIHNlbGVjdG9yXG5cdCAgICB0aGlzLnJvb3QgPSBkMy5zZWxlY3QoZWx0KTtcblx0ZWxzZSBpZiAodHlwZW9mKGVsdC5zZWxlY3RBbGwpID09PSBcImZ1bmN0aW9uXCIpXG5cdCAgICAvLyBlbHQgaXMgYSBkMyBzZWxlY3Rpb25cblx0ICAgIHRoaXMucm9vdCA9IGVsdDtcblx0ZWxzZSBpZiAodHlwZW9mKGVsdC5nZXRFbGVtZW50c0J5VGFnTmFtZSkgPT09IFwiZnVuY3Rpb25cIilcblx0ICAgIC8vIGVsdCBpcyBhIERPTSBub2RlXG5cdCAgICB0aGlzLnJvb3QgPSBkMy5zZWxlY3QoZWx0KTtcbiAgICB9XG4gICAgaW5pdERvbSAoKSB7XG4gICAgICAgIC8vIG92ZXJyaWRlIG1lXG4gICAgfVxufVxuXG5leHBvcnQgeyBDb21wb25lbnQgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0NvbXBvbmVudC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgZGVmYXVsdCB7XG4gICAgTUdWQXBwIDoge1xuXHRuYW1lIDpcdFwiTXVsdGlwbGUgR2Vub21lIFZpZXdlciAoTUdWKVwiLFxuXHR2ZXJzaW9uIDpcdFwiMS4wLjBcIiwgLy8gdXNlIHNlbWFudGljIHZlcnNpb25pbmdcbiAgICB9LFxuICAgIEF1eERhdGFNYW5hZ2VyIDoge1xuXHRtb3VzZW1pbmUgOiAndGVzdCcsXG5cdGFsbE1pbmVzIDoge1xuXHQgICAgJ2RldicgOiAnaHR0cDovL2JobWdpbW0tZGV2OjgwODAvbW91c2VtaW5lJyxcblx0ICAgICd0ZXN0JzogJ2h0dHA6Ly90ZXN0Lm1vdXNlbWluZS5vcmcvbW91c2VtaW5lJyxcblx0ICAgICdwdWJsaWMnIDogJ2h0dHA6Ly93d3cubW91c2VtaW5lLm9yZy9tb3VzZW1pbmUnLFxuXHR9XG4gICAgfSxcbiAgICBTVkdWaWV3IDoge1xuXHRvdXRlcldpZHRoIDogMTAwLFxuXHR3aWR0aCA6IDEwMCxcblx0b3V0ZXJIZWlnaHQgOiAxMDAsXG5cdGhlaWdodCA6IDEwMCxcblx0bWFyZ2lucyA6IHt0b3A6IDE4LCByaWdodDogMTIsIGJvdHRvbTogMTIsIGxlZnQ6IDEyfVxuICAgIH0sXG4gICAgWm9vbVZpZXcgOiB7XG5cdHRvcE9mZnNldCA6IDIwLFx0XHQvLyBZIG9mZnNldCB0byBmaXJzdCBzdHJpcCAoc2hvdWxkID0gc3RyaXBHYXAsIHNvIHRlY2huaWNhbGx5IHJlZHVuZGFudClcblx0ZmVhdEhlaWdodCA6IDgsXHRcdC8vIGhlaWdodCBvZiBhIHJlY3RhbmdsZSByZXByZXNlbnRpbmcgYSBmZWF0dXJlXG5cdGxhbmVHYXAgOiAyLFx0ICAgICAgICAvLyBzcGFjZSBiZXR3ZWVuIHN3aW0gbGFuZXNcblx0bGFuZUhlaWdodCA6IDEwLFx0Ly8gPT0gZmVhdEhlaWdodCArIGxhbmVHYXBcblx0bWluTGFuZXMgOiAzLFx0XHQvLyBtaW5pbXVtIG51bWJlciBvZiBzd2ltIGxhbmVzIChlYWNoIHN0cmFuZClcblx0YmxvY2tIZWlnaHQgOiA2MCxcdC8vID09IDIgKiBtaW5MYW5lcyAqIGxhbmVIZWlnaHRcblx0bWluU3RyaXBIZWlnaHQgOiA3NSwgICAgLy8gaGVpZ2h0IHBlciBnZW5vbWUgaW4gdGhlIHpvb20gdmlld1xuXHRzdHJpcEdhcCA6IDIwLFx0Ly8gc3BhY2UgYmV0d2VlbiBzdHJpcHNcblx0bWF4U0JnYXAgOiAyMCxcdC8vIG1heCBnYXAgYWxsb3dlZCBiZXR3ZWVuIGJsb2Nrcy5cblx0ZG1vZGUgOiAnY29tcGFyaXNvbicsLy8gaW5pdGlhbCBkcmF3aW5nIG1vZGUuICdjb21wYXJpc29uJyBvciAncmVmZXJlbmNlJ1xuXHR3aGVlbFRocmVzaG9sZCA6IDMsXHQvLyBtaW5pbXVtIHdoZWVsIGRpc3RhbmNlIFxuXHRmZWF0dXJlRGV0YWlsVGhyZXNob2xkIDogMjAwMDAwMCwgLy8gaWYgd2lkdGggPD0gdGhyZXNoLCBkcmF3IGZlYXR1cmUgZGV0YWlscy5cblx0d2hlZWxDb250ZXh0RGVsYXkgOiAzMDAsICAvLyBtcyBkZWxheSBhZnRlciBsYXN0IHdoZWVsIGV2ZW50IGJlZm9yZSBjaGFuZ2luZyBjb250ZXh0XG4gICAgfSxcbiAgICBRdWVyeU1hbmFnZXIgOiB7XG5cdHNlYXJjaFR5cGVzIDogW3tcblx0ICAgIG1ldGhvZDogXCJmZWF0dXJlc0J5UGhlbm90eXBlXCIsXG5cdCAgICBsYWJlbDogXCIuLi5ieSBwaGVub3R5cGUgb3IgZGlzZWFzZVwiLFxuXHQgICAgdGVtcGxhdGU6IFwiXCIsXG5cdCAgICBwbGFjZWhvbGRlcjogXCJQaGVuby9kaXNlYXNlIChNUC9ETykgdGVybSBvciBJRHNcIlxuXHR9LHtcblx0ICAgIG1ldGhvZDogXCJmZWF0dXJlc0J5RnVuY3Rpb25cIixcblx0ICAgIGxhYmVsOiBcIi4uLmJ5IGNlbGx1bGFyIGZ1bmN0aW9uXCIsXG5cdCAgICB0ZW1wbGF0ZTogXCJcIixcblx0ICAgIHBsYWNlaG9sZGVyOiBcIkdlbmUgT250b2xvZ3kgKEdPKSB0ZXJtcyBvciBJRHNcIlxuXHR9LHtcblx0ICAgIG1ldGhvZDogXCJmZWF0dXJlc0J5UGF0aHdheVwiLFxuXHQgICAgbGFiZWw6IFwiLi4uYnkgcGF0aHdheVwiLFxuXHQgICAgdGVtcGxhdGU6IFwiXCIsXG5cdCAgICBwbGFjZWhvbGRlcjogXCJSZWFjdG9tZSBwYXRod2F5cyBuYW1lcywgSURzXCJcblx0fSx7XG5cdCAgICBtZXRob2Q6IFwiZmVhdHVyZXNCeUlkXCIsXG5cdCAgICBsYWJlbDogXCIuLi5ieSBzeW1ib2wvSURcIixcblx0ICAgIHRlbXBsYXRlOiBcIlwiLFxuXHQgICAgcGxhY2Vob2xkZXI6IFwiTUdJIG5hbWVzLCBzeW5vbnltcywgZXRjLlwiXG5cdH1dXG4gICAgfVxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL2NvbmZpZy5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBTdG9yZSwgc2V0LCBnZXQsIGRlbCwgY2xlYXIsIGtleXMgfSBmcm9tICdpZGIta2V5dmFsJztcblxuY29uc3QgREJfTkFNRV9QUkVGSVggPSAnbWd2LWRhdGFjYWNoZS0nO1xuXG5jbGFzcyBLZXlTdG9yZSB7XG4gICAgY29uc3RydWN0b3IgKG5hbWUpIHtcblx0dHJ5IHtcblx0ICAgIHRoaXMuc3RvcmUgPSBuZXcgU3RvcmUoREJfTkFNRV9QUkVGSVgrbmFtZSwgbmFtZSk7XG5cdCAgICB0aGlzLmRpc2FibGVkID0gZmFsc2U7XG5cdCAgICBjb25zb2xlLmxvZyhgS2V5U3RvcmU6ICR7REJfTkFNRV9QUkVGSVgrbmFtZX1gKTtcblx0fVxuXHRjYXRjaCAoZXJyKSB7XG5cdCAgICB0aGlzLnN0b3JlID0gbnVsbDtcblx0ICAgIHRoaXMuZGlzYWJsZWQgPSB0cnVlO1xuXHQgICAgdGhpcy5udWxsUCA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblx0ICAgIGNvbnNvbGUubG9nKGBLZXlTdG9yZTogZXJyb3IgaW4gY29uc3RydWN0b3I6ICR7ZXJyfSBcXG4gRGlzYWJsZWQuYClcblx0fVxuICAgIH1cbiAgICBnZXQgKGtleSkge1xuXHRpZiAodGhpcy5kaXNhYmxlZCkgXG5cdCAgICByZXR1cm4gdGhpcy5udWxsUDtcbiAgICAgICAgcmV0dXJuIGdldChrZXksIHRoaXMuc3RvcmUpO1xuICAgIH1cbiAgICBkZWwgKGtleSkge1xuXHRpZiAodGhpcy5kaXNhYmxlZCkgXG5cdCAgICByZXR1cm4gdGhpcy5udWxsUDtcbiAgICAgICAgcmV0dXJuIGRlbChrZXksIHRoaXMuc3RvcmUpO1xuICAgIH1cbiAgICBzZXQgKGtleSwgdmFsdWUpIHtcblx0aWYgKHRoaXMuZGlzYWJsZWQpIFxuXHQgICAgcmV0dXJuIHRoaXMubnVsbFA7XG4gICAgICAgIHJldHVybiBzZXQoa2V5LCB2YWx1ZSwgdGhpcy5zdG9yZSk7XG4gICAgfVxuICAgIHB1dCAoa2V5LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgfVxuICAgIGtleXMgKCkge1xuXHRpZiAodGhpcy5kaXNhYmxlZCkgXG5cdCAgICByZXR1cm4gdGhpcy5udWxsUDtcbiAgICAgICAgcmV0dXJuIGtleXModGhpcy5zdG9yZSk7XG4gICAgfVxuICAgIGNvbnRhaW5zIChrZXkpIHtcblx0aWYgKHRoaXMuZGlzYWJsZWQpIFxuXHQgICAgcmV0dXJuIHRoaXMubnVsbFA7XG4gICAgICAgIHJldHVybiB0aGlzLmdldChrZXkpLnRoZW4oeCA9PiB4ICE9PSB1bmRlZmluZWQpO1xuICAgIH1cbiAgICBjbGVhciAoKSB7XG5cdGlmICh0aGlzLmRpc2FibGVkKSBcblx0ICAgIHJldHVybiB0aGlzLm51bGxQO1xuICAgICAgICByZXR1cm4gY2xlYXIodGhpcy5zdG9yZSk7XG4gICAgfVxufTtcblxuZXhwb3J0IHsgS2V5U3RvcmUgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0tleVN0b3JlLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNsYXNzIEdlbm9taWNJbnRlcnZhbCB7XG4gICAgY29uc3RydWN0b3IgKGNmZykge1xuICAgICAgICB0aGlzLmdlbm9tZSAgPSBjZmcuZ2Vub21lO1xuICAgICAgICB0aGlzLmNociAgICAgPSBjZmcuY2hyIHx8IGNmZy5jaHJvbW9zb21lO1xuICAgICAgICB0aGlzLnN0YXJ0ICAgPSBwYXJzZUludChjZmcuc3RhcnQpO1xuICAgICAgICB0aGlzLmVuZCAgICAgPSBwYXJzZUludChjZmcuZW5kKTtcbiAgICAgICAgdGhpcy5zdHJhbmQgID0gY2ZnLnN0cmFuZDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0IGxlbmd0aCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVuZCAtIHRoaXMuc3RhcnQgKyAxO1xuICAgIH1cbn1cblxuY2xhc3MgRXhvbiBleHRlbmRzIEdlbm9taWNJbnRlcnZhbCB7XG4gICAgY29uc3RydWN0b3IgKGNmZykge1xuICAgICAgICBzdXBlcihjZmcpO1xuXHR0aGlzLklEID0gY2ZnLnByaW1hcnlJZGVudGlmaWVyO1xuXHR0aGlzLmNocjtcbiAgICB9XG59XG5cbmNsYXNzIEZlYXR1cmUgZXh0ZW5kcyBHZW5vbWljSW50ZXJ2YWwge1xuICAgIGNvbnN0cnVjdG9yIChjZmcpIHtcblx0c3VwZXIoY2ZnKTtcbiAgICAgICAgdGhpcy50eXBlICAgID0gY2ZnLnR5cGU7XG4gICAgICAgIHRoaXMuYmlvdHlwZSA9IGNmZy5iaW90eXBlO1xuICAgICAgICB0aGlzLm1ncGlkICAgPSBjZmcubWdwaWQgfHwgY2ZnLmlkO1xuICAgICAgICB0aGlzLm1naWlkICAgPSBjZmcubWdpaWQ7XG4gICAgICAgIHRoaXMuc3ltYm9sICA9IGNmZy5zeW1ib2w7XG5cdHRoaXMuY29udGlnICA9IHBhcnNlSW50KGNmZy5jb250aWcpO1xuXHR0aGlzLmxhbmUgICAgPSBwYXJzZUludChjZmcubGFuZSk7XG4gICAgICAgIGlmICh0aGlzLm1naWlkID09PSBcIi5cIikgdGhpcy5tZ2lpZCA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLnN5bWJvbCA9PT0gXCIuXCIpIHRoaXMuc3ltYm9sID0gbnVsbDtcblx0Ly9cblx0dGhpcy5leG9uc0xvYWRlZCA9IGZhbHNlO1xuXHR0aGlzLmV4b25zID0gW107XG5cdHRoaXMudHJhbnNjcmlwdHMgPSBbXTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0IElEICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWdwaWQ7XG4gICAgfVxuICAgIGdldCBjYW5vbmljYWwgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tZ2lpZDtcbiAgICB9XG4gICAgZ2V0IGlkICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWdpaWQgfHwgdGhpcy5tZ3BpZDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0IGxhYmVsICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ltYm9sIHx8IHRoaXMubWdwaWQ7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldE11bmdlZFR5cGUgKCkge1xuXHRyZXR1cm4gdGhpcy50eXBlID09PSBcImdlbmVcIiA/XG5cdCAgICAodGhpcy5iaW90eXBlID09PSBcInByb3RlaW5fY29kaW5nXCIgfHwgdGhpcy5iaW90eXBlID09PSBcInByb3RlaW4gY29kaW5nIGdlbmVcIikgP1xuXHRcdFwicHJvdGVpbl9jb2RpbmdfZ2VuZVwiXG5cdFx0OlxuXHRcdHRoaXMuYmlvdHlwZS5pbmRleE9mKFwicHNldWRvZ2VuZVwiKSA+PSAwID9cblx0XHQgICAgXCJwc2V1ZG9nZW5lXCJcblx0XHQgICAgOlxuXHRcdCAgICAodGhpcy5iaW90eXBlLmluZGV4T2YoXCJSTkFcIikgPj0gMCB8fCB0aGlzLmJpb3R5cGUuaW5kZXhPZihcImFudGlzZW5zZVwiKSA+PSAwKSA/XG5cdFx0XHRcIm5jUk5BX2dlbmVcIlxuXHRcdFx0OlxuXHRcdFx0dGhpcy5iaW90eXBlLmluZGV4T2YoXCJzZWdtZW50XCIpID49IDAgP1xuXHRcdFx0ICAgIFwiZ2VuZV9zZWdtZW50XCJcblx0XHRcdCAgICA6XG5cdFx0XHQgICAgXCJvdGhlcl9nZW5lXCJcblx0ICAgIDpcblx0ICAgIHRoaXMudHlwZSA9PT0gXCJwc2V1ZG9nZW5lXCIgP1xuXHRcdFwicHNldWRvZ2VuZVwiXG5cdFx0OlxuXHRcdHRoaXMudHlwZS5pbmRleE9mKFwiZ2VuZV9zZWdtZW50XCIpID49IDAgP1xuXHRcdCAgICBcImdlbmVfc2VnbWVudFwiXG5cdFx0ICAgIDpcblx0XHQgICAgdGhpcy50eXBlLmluZGV4T2YoXCJSTkFcIikgPj0gMCA/XG5cdFx0XHRcIm5jUk5BX2dlbmVcIlxuXHRcdFx0OlxuXHRcdFx0dGhpcy50eXBlLmluZGV4T2YoXCJnZW5lXCIpID49IDAgP1xuXHRcdFx0ICAgIFwib3RoZXJfZ2VuZVwiXG5cdFx0XHQgICAgOlxuXHRcdFx0ICAgIFwib3RoZXJfZmVhdHVyZV90eXBlXCI7XG4gICAgfVxufVxuXG5leHBvcnQgeyBGZWF0dXJlIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9GZWF0dXJlLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUGFyc2VzIGEgbGlzdCBvcGVyYXRvciBleHByZXNzaW9uLCBlZyBcIihhICsgYikqYyAtIGRcIlxuLy8gUmV0dXJucyBhbiBhYnN0cmFjdCBzeW50YXggdHJlZS5cbi8vICAgICBMZWFmIG5vZGVzID0gbGlzdCBuYW1lcy4gVGhleSBhcmUgc2ltcGxlIHN0cmluZ3MuXG4vLyAgICAgSW50ZXJpb3Igbm9kZXMgPSBvcGVyYXRpb25zLiBUaGV5IGxvb2sgbGlrZToge2xlZnQ6bm9kZSwgb3A6c3RyaW5nLCByaWdodDpub2RlfVxuLy8gXG5jbGFzcyBMaXN0Rm9ybXVsYVBhcnNlciB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuXHR0aGlzLnJfb3AgICAgPSAvWystXS87XG5cdHRoaXMucl9vcDIgICA9IC9bKl0vO1xuXHR0aGlzLnJfb3BzICAgPSAvWygpKyotXS87XG5cdHRoaXMucl9pZGVudCA9IC9bYS16QS1aX11bYS16QS1aMC05X10qLztcblx0dGhpcy5yX3FzdHIgID0gL1wiW15cIl0qXCIvO1xuXHR0aGlzLnJlID0gbmV3IFJlZ0V4cChgKCR7dGhpcy5yX29wcy5zb3VyY2V9fCR7dGhpcy5yX3FzdHIuc291cmNlfXwke3RoaXMucl9pZGVudC5zb3VyY2V9KWAsICdnJyk7XG5cdC8vdGhpcy5yZSA9IC8oWygpKyotXXxcIlteXCJdK1wifFthLXpBLVpfXVthLXpBLVowLTlfXSopL2dcblx0dGhpcy5faW5pdChcIlwiKTtcbiAgICB9XG4gICAgX2luaXQgKHMpIHtcbiAgICAgICAgdGhpcy5leHByID0gcztcblx0dGhpcy50b2tlbnMgPSB0aGlzLmV4cHIubWF0Y2godGhpcy5yZSkgfHwgW107XG5cdHRoaXMuaSA9IDA7XG4gICAgfVxuICAgIF9wZWVrVG9rZW4oKSB7XG5cdHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmldO1xuICAgIH1cbiAgICBfbmV4dFRva2VuICgpIHtcblx0bGV0IHQ7XG4gICAgICAgIGlmICh0aGlzLmkgPCB0aGlzLnRva2Vucy5sZW5ndGgpIHtcblx0ICAgIHQgPSB0aGlzLnRva2Vuc1t0aGlzLmldO1xuXHQgICAgdGhpcy5pICs9IDE7XG5cdH1cblx0cmV0dXJuIHQ7XG4gICAgfVxuICAgIF9leHByICgpIHtcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLl90ZXJtKCk7XG5cdGxldCBvcCA9IHRoaXMuX3BlZWtUb2tlbigpO1xuXHRpZiAob3AgPT09IFwiK1wiIHx8IG9wID09PSBcIi1cIikge1xuXHQgICAgdGhpcy5fbmV4dFRva2VuKCk7XG5cdCAgICBub2RlID0geyBsZWZ0Om5vZGUsIG9wOm9wPT09XCIrXCI/XCJ1bmlvblwiOlwiZGlmZmVyZW5jZVwiLCByaWdodDogdGhpcy5fZXhwcigpIH1cblx0ICAgIHJldHVybiBub2RlO1xuICAgICAgICB9ICAgICAgICAgICAgICAgXG5cdGVsc2UgaWYgKG9wID09PSBcIilcIiB8fCBvcCA9PT0gdW5kZWZpbmVkIHx8IG9wID09PSBudWxsKVxuXHQgICAgcmV0dXJuIG5vZGU7XG5cdGVsc2Vcblx0ICAgIHRoaXMuX2Vycm9yKFwiVU5JT04gb3IgSU5URVJTRUNUSU9OIG9yICkgb3IgTlVMTFwiLCBvcCk7XG4gICAgfVxuICAgIF90ZXJtICgpIHtcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLl9mYWN0b3IoKTtcblx0bGV0IG9wID0gdGhpcy5fcGVla1Rva2VuKCk7XG5cdGlmIChvcCA9PT0gXCIqXCIpIHtcblx0ICAgIHRoaXMuX25leHRUb2tlbigpO1xuXHQgICAgbm9kZSA9IHsgbGVmdDpub2RlLCBvcDpcImludGVyc2VjdGlvblwiLCByaWdodDogdGhpcy5fZmFjdG9yKCkgfVxuXHR9XG5cdHJldHVybiBub2RlO1xuICAgIH1cbiAgICBfZmFjdG9yICgpIHtcbiAgICAgICAgbGV0IHQgPSB0aGlzLl9uZXh0VG9rZW4oKTtcblx0aWYgKHQgPT09IFwiKFwiKXtcblx0ICAgIGxldCBub2RlID0gdGhpcy5fZXhwcigpO1xuXHQgICAgbGV0IG50ID0gdGhpcy5fbmV4dFRva2VuKCk7XG5cdCAgICBpZiAobnQgIT09IFwiKVwiKSB0aGlzLl9lcnJvcihcIicpJ1wiLCBudCk7XG5cdCAgICByZXR1cm4gbm9kZTtcblx0fVxuXHRlbHNlIGlmICh0ICYmICh0LnN0YXJ0c1dpdGgoJ1wiJykpKSB7XG5cdCAgICByZXR1cm4gdC5zdWJzdHJpbmcoMSwgdC5sZW5ndGgtMSk7XG5cdH1cblx0ZWxzZSBpZiAodCAmJiB0Lm1hdGNoKC9bYS16QS1aX10vKSkge1xuXHQgICAgcmV0dXJuIHQ7XG5cdH1cblx0ZWxzZVxuXHQgICAgdGhpcy5fZXJyb3IoXCJFWFBSIG9yIElERU5UXCIsIHR8fFwiTlVMTFwiKTtcblx0cmV0dXJuIHQ7XG5cdCAgICBcbiAgICB9XG4gICAgX2Vycm9yIChleHBlY3RlZCwgc2F3KSB7XG4gICAgICAgIHRocm93IGBQYXJzZSBlcnJvcjogZXhwZWN0ZWQgJHtleHBlY3RlZH0gYnV0IHNhdyAke3Nhd30uYDtcbiAgICB9XG4gICAgLy8gUGFyc2VzIHRoZSBzdHJpbmcgYW5kIHJldHVybnMgdGhlIGFic3RyYWN0IHN5bnRheCB0cmVlLlxuICAgIC8vIFRocm93cyBhbiBleGNlcHRpb24gaWYgdGhlcmUgaXMgYSBzeW50YXggZXJyb3IuXG4gICAgcGFyc2UgKHMpIHtcblx0dGhpcy5faW5pdChzKTtcblx0cmV0dXJuIHRoaXMuX2V4cHIoKTtcbiAgICB9XG4gICAgLy8gcmV0dXJucyB0cnVlIGlmZiBzdHJpbmcgaXMgc3ludGFjdGljYWxseSB2YWxpZFxuICAgIGlzVmFsaWQgKHMpIHtcbiAgICAgICAgdHJ5IHtcblx0ICAgIHRoaXMucGFyc2Uocyk7XG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0fVxuXHRjYXRjaCAoZSkge1xuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHR9XG4gICAgfVxufVxuXG5leHBvcnQgeyBMaXN0Rm9ybXVsYVBhcnNlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvTGlzdEZvcm11bGFQYXJzZXIuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgU1ZHVmlldyBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKGFwcCwgZWx0LCB3aWR0aCwgaGVpZ2h0LCBtYXJnaW5zLCByb3RhdGlvbiwgdHJhbnNsYXRpb24pIHtcbiAgICAgICAgc3VwZXIoYXBwLCBlbHQpO1xuICAgICAgICB0aGlzLnN2ZyA9IHRoaXMucm9vdC5zZWxlY3QoXCJzdmdcIik7XG4gICAgICAgIHRoaXMuc3ZnTWFpbiA9IHRoaXMuc3ZnXG4gICAgICAgICAgICAuYXBwZW5kKFwiZ1wiKSAgICAvLyB0aGUgbWFyZ2luLXRyYW5zbGF0ZWQgZ3JvdXBcbiAgICAgICAgICAgIC5hcHBlbmQoXCJnXCIpXHQgIC8vIG1haW4gZ3JvdXAgZm9yIHRoZSBkcmF3aW5nXG5cdCAgICAuYXR0cihcIm5hbWVcIixcInN2Z21haW5cIik7XG5cdGxldCBjID0gY29uZmlnLlNWR1ZpZXc7XG5cdHRoaXMub3V0ZXJXaWR0aCA9IGMub3V0ZXJXaWR0aDtcblx0dGhpcy53aWR0aCA9IGMud2lkdGg7XG5cdHRoaXMub3V0ZXJIZWlnaHQgPSBjLm91dGVySGVpZ2h0O1xuXHR0aGlzLmhlaWdodCA9IGMuaGVpZ2h0O1xuXHR0aGlzLm1hcmdpbnMgPSBPYmplY3QuYXNzaWduKHt9LCBjLm1hcmdpbnMpO1xuXHR0aGlzLnJvdGF0aW9uID0gMDtcblx0dGhpcy50cmFuc2xhdGlvbiA9IFswLDBdO1xuXHQvL1xuICAgICAgICB0aGlzLnNldEdlb20oe3dpZHRoLCBoZWlnaHQsIG1hcmdpbnMsIHJvdGF0aW9uLCB0cmFuc2xhdGlvbn0pO1xuICAgIH1cbiAgICBzZXRHZW9tIChjZmcpIHtcbiAgICAgICAgdGhpcy5vdXRlcldpZHRoICA9IGNmZy53aWR0aCAgICAgICB8fCB0aGlzLm91dGVyV2lkdGg7XG4gICAgICAgIHRoaXMub3V0ZXJIZWlnaHQgPSBjZmcuaGVpZ2h0ICAgICAgfHwgdGhpcy5vdXRlckhlaWdodDtcbiAgICAgICAgdGhpcy5tYXJnaW5zICAgICA9IGNmZy5tYXJnaW5zICAgICB8fCB0aGlzLm1hcmdpbnM7XG5cdHRoaXMucm90YXRpb24gICAgPSB0eXBlb2YoY2ZnLnJvdGF0aW9uKSA9PT0gXCJudW1iZXJcIiA/IGNmZy5yb3RhdGlvbiA6IHRoaXMucm90YXRpb247XG5cdHRoaXMudHJhbnNsYXRpb24gPSBjZmcudHJhbnNsYXRpb24gfHwgdGhpcy50cmFuc2xhdGlvbjtcbiAgICAgICAgLy9cbiAgICAgICAgdGhpcy53aWR0aCAgPSB0aGlzLm91dGVyV2lkdGggIC0gdGhpcy5tYXJnaW5zLmxlZnQgLSB0aGlzLm1hcmdpbnMucmlnaHQ7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5vdXRlckhlaWdodCAtIHRoaXMubWFyZ2lucy50b3AgIC0gdGhpcy5tYXJnaW5zLmJvdHRvbTtcbiAgICAgICAgLy9cbiAgICAgICAgdGhpcy5zdmcuYXR0cihcIndpZHRoXCIsIHRoaXMub3V0ZXJXaWR0aClcbiAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgdGhpcy5vdXRlckhlaWdodClcbiAgICAgICAgICAgIC5zZWxlY3QoJ2dbbmFtZT1cInN2Z21haW5cIl0nKVxuICAgICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBgdHJhbnNsYXRlKCR7dGhpcy5tYXJnaW5zLmxlZnR9LCR7dGhpcy5tYXJnaW5zLnRvcH0pIHJvdGF0ZSgke3RoaXMucm90YXRpb259KSB0cmFuc2xhdGUoJHt0aGlzLnRyYW5zbGF0aW9uWzBdfSwke3RoaXMudHJhbnNsYXRpb25bMV19KWApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc2V0TWFyZ2lucyggdG0sIHJtLCBibSwgbG0gKSB7XG5cdGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG5cdCAgICBybSA9IGJtID0gbG0gPSB0bTtcblx0fVxuXHRlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG5cdCAgICBibSA9IHRtO1xuXHQgICAgbG0gPSBybTtcblx0fVxuXHRlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSA0KVxuXHQgICAgdGhyb3cgXCJCYWQgYXJndW1lbnRzLlwiO1xuICAgICAgICAvL1xuXHR0aGlzLnNldEdlb20oe3RvcDogdG0sIHJpZ2h0OiBybSwgYm90dG9tOiBibSwgbGVmdDogbG19KTtcblx0Ly9cblx0cmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJvdGF0ZSAoZGVnKSB7XG4gICAgICAgIHRoaXMuc2V0R2VvbSh7cm90YXRpb246ZGVnfSk7XG5cdHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB0cmFuc2xhdGUgKGR4LCBkeSkge1xuICAgICAgICB0aGlzLnNldEdlb20oe3RyYW5zbGF0aW9uOltkeCxkeV19KTtcblx0cmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICB0aGUgd2luZG93IHdpZHRoXG4gICAgZml0VG9XaWR0aCAod2lkdGgpIHtcbiAgICAgICAgbGV0IHIgPSB0aGlzLnN2Z1swXVswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdGhpcy5zZXRHZW9tKHt3aWR0aDogd2lkdGggLSByLnh9KVxuXHRyZXR1cm4gdGhpcztcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBTVkdWaWV3XG5cbmV4cG9ydCB7IFNWR1ZpZXcgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL1NWR1ZpZXcuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgTUdWQXBwIH0gZnJvbSAnLi9NR1ZBcHAnO1xuaW1wb3J0IHsgcmVtb3ZlRHVwcyB9IGZyb20gJy4vdXRpbHMnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy9cbi8vIHBxc3RyaW5nID0gUGFyc2UgcXN0cmluZy4gUGFyc2VzIHRoZSBwYXJhbWV0ZXIgcG9ydGlvbiBvZiB0aGUgVVJMLlxuLy9cbmZ1bmN0aW9uIHBxc3RyaW5nIChxc3RyaW5nKSB7XG4gICAgLy9cbiAgICBsZXQgY2ZnID0ge307XG5cbiAgICAvLyBGSVhNRTogVVJMU2VhcmNoUGFyYW1zIEFQSSBpcyBub3Qgc3VwcG9ydGVkIGluIGFsbCBicm93c2Vycy5cbiAgICAvLyBPSyBmb3IgZGV2ZWxvcG1lbnQgYnV0IG5lZWQgYSBmYWxsYmFjayBldmVudHVhbGx5LlxuICAgIGxldCBwcm1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhxc3RyaW5nKTtcbiAgICBsZXQgZ2Vub21lcyA9IFtdO1xuXG4gICAgLy8gLS0tLS0gZ2Vub21lcyAtLS0tLS0tLS0tLS1cbiAgICBsZXQgcGdlbm9tZXMgPSBwcm1zLmdldChcImdlbm9tZXNcIikgfHwgXCJcIjtcbiAgICAvLyBGb3Igbm93LCBhbGxvdyBcImNvbXBzXCIgYXMgc3lub255bSBmb3IgXCJnZW5vbWVzXCIuIEV2ZW50dWFsbHksIGRvbid0IHN1cHBvcnQgXCJjb21wc1wiLlxuICAgIHBnZW5vbWVzID0gKHBnZW5vbWVzICsgIFwiIFwiICsgKHBybXMuZ2V0KFwiY29tcHNcIikgfHwgXCJcIikpO1xuICAgIC8vXG4gICAgcGdlbm9tZXMgPSByZW1vdmVEdXBzKHBnZW5vbWVzLnRyaW0oKS5zcGxpdCgvICsvKSk7XG4gICAgcGdlbm9tZXMubGVuZ3RoID4gMCAmJiAoY2ZnLmdlbm9tZXMgPSBwZ2Vub21lcyk7XG5cbiAgICAvLyAtLS0tLSByZWYgZ2Vub21lIC0tLS0tLS0tLS0tLVxuICAgIGxldCByZWYgPSBwcm1zLmdldChcInJlZlwiKTtcbiAgICByZWYgJiYgKGNmZy5yZWYgPSByZWYpO1xuXG4gICAgLy8gLS0tLS0gaGlnaGxpZ2h0IElEcyAtLS0tLS0tLS0tLS0tLVxuICAgIGxldCBobHMgPSBuZXcgU2V0KCk7XG4gICAgbGV0IGhsczAgPSBwcm1zLmdldChcImhpZ2hsaWdodFwiKTtcbiAgICBpZiAoaGxzMCkge1xuXHRobHMwID0gaGxzMC5yZXBsYWNlKC9bICxdKy9nLCAnICcpLnNwbGl0KCcgJykuZmlsdGVyKHg9PngpO1xuXHRobHMwLmxlbmd0aCA+IDAgJiYgKGNmZy5oaWdobGlnaHQgPSBobHMwKTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLSBjb29yZGluYXRlcyAtLS0tLS0tLS0tLS0tLVxuICAgIC8vXG4gICAgbGV0IGNociAgID0gcHJtcy5nZXQoXCJjaHJcIik7XG4gICAgbGV0IHN0YXJ0ID0gcHJtcy5nZXQoXCJzdGFydFwiKTtcbiAgICBsZXQgZW5kICAgPSBwcm1zLmdldChcImVuZFwiKTtcbiAgICBjaHIgICAmJiAoY2ZnLmNociA9IGNocik7XG4gICAgc3RhcnQgJiYgKGNmZy5zdGFydCA9IHBhcnNlSW50KHN0YXJ0KSk7XG4gICAgZW5kICAgJiYgKGNmZy5lbmQgPSBwYXJzZUludChlbmQpKTtcbiAgICAvL1xuICAgIGxldCBsYW5kbWFyayA9IHBybXMuZ2V0KFwibGFuZG1hcmtcIik7XG4gICAgbGV0IGZsYW5rICAgID0gcHJtcy5nZXQoXCJmbGFua1wiKTtcbiAgICBsZXQgbGVuZ3RoICAgPSBwcm1zLmdldChcImxlbmd0aFwiKTtcbiAgICBsZXQgZGVsdGEgICAgPSBwcm1zLmdldChcImRlbHRhXCIpO1xuICAgIGxhbmRtYXJrICYmIChjZmcubGFuZG1hcmsgPSBsYW5kbWFyayk7XG4gICAgZmxhbmsgICAgJiYgKGNmZy5mbGFuayA9IHBhcnNlSW50KGZsYW5rKSk7XG4gICAgbGVuZ3RoICAgJiYgKGNmZy5sZW5ndGggPSBwYXJzZUludChsZW5ndGgpKTtcbiAgICBkZWx0YSAgICAmJiAoY2ZnLmRlbHRhID0gcGFyc2VJbnQoZGVsdGEpKTtcbiAgICAvL1xuICAgIC8vIC0tLS0tIGRyYXdpbmcgbW9kZSAtLS0tLS0tLS0tLS0tXG4gICAgbGV0IGRtb2RlID0gcHJtcy5nZXQoXCJkbW9kZVwiKTtcbiAgICBkbW9kZSAmJiAoY2ZnLmRtb2RlID0gZG1vZGUpO1xuICAgIC8vXG4gICAgcmV0dXJuIGNmZztcbn1cblxuXG4vLyBUaGUgbWFpbiBwcm9ncmFtLCB3aGVyZWluIHRoZSBhcHAgaXMgY3JlYXRlZCBhbmQgd2lyZWQgdG8gdGhlIGJyb3dzZXIuIFxuLy9cbmZ1bmN0aW9uIF9fbWFpbl9fIChzZWxlY3Rvcikge1xuICAgIC8vIEJlaG9sZCwgdGhlIE1HViBhcHBsaWNhdGlvbiBvYmplY3QuLi5cbiAgICBsZXQgbWd2ID0gbnVsbDtcblxuICAgIC8vIENhbGxiYWNrIHRvIHBhc3MgaW50byB0aGUgYXBwIHRvIHJlZ2lzdGVyIGNoYW5nZXMgaW4gY29udGV4dC5cbiAgICAvLyBVc2VzIHRoZSBjdXJyZW50IGFwcCBjb250ZXh0IHRvIHNldCB0aGUgaGFzaCBwYXJ0IG9mIHRoZVxuICAgIC8vIGJyb3dzZXIncyBsb2NhdGlvbi4gVGhpcyBhbHNvIHJlZ2lzdGVycyB0aGUgY2hhbmdlIGluIFxuICAgIC8vIHRoZSBicm93c2VyIGhpc3RvcnkuXG4gICAgZnVuY3Rpb24gc2V0SGFzaCAoKSB7XG5cdGxldCBuZXdIYXNoID0gbWd2LmdldFBhcmFtU3RyaW5nKCk7XG5cdGlmICgnIycrbmV3SGFzaCA9PT0gd2luZG93LmxvY2F0aW9uLmhhc2gpXG5cdCAgICByZXR1cm47XG5cdC8vIHRlbXBvcmFyaWx5IGRpc2FibGUgcG9wc3RhdGUgaGFuZGxlclxuXHRsZXQgZiA9IHdpbmRvdy5vbnBvcHN0YXRlO1xuXHR3aW5kb3cub25wb3BzdGF0ZSA9IG51bGw7XG5cdC8vIG5vdyBzZXQgdGhlIGhhc2hcblx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSBuZXdIYXNoO1xuXHQvLyByZS1lbmFibGVcblx0d2luZG93Lm9ucG9wc3RhdGUgPSBmO1xuICAgIH1cbiAgICAvLyBIYW5kbGVyIGNhbGxlZCB3aGVuIHVzZXIgY2xpY2tzIHRoZSBicm93c2VyJ3MgYmFjayBvciBmb3J3YXJkIGJ1dHRvbnMuXG4gICAgLy8gU2V0cyB0aGUgYXBwJ3MgY29udGV4dCBiYXNlZCBvbiB0aGUgaGFzaCBwYXJ0IG9mIHRoZSBicm93c2VyJ3NcbiAgICAvLyBsb2NhdGlvbi5cbiAgICB3aW5kb3cub25wb3BzdGF0ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdGxldCBjZmcgPSBwcXN0cmluZyhkb2N1bWVudC5sb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKSk7XG5cdG1ndi5zZXRDb250ZXh0KGNmZywgdHJ1ZSk7XG4gICAgfTtcbiAgICAvLyBnZXQgaW5pdGlhbCBzZXQgb2YgY29udGV4dCBwYXJhbXMgXG4gICAgbGV0IHFzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSk7XG4gICAgbGV0IGNmZyA9IHBxc3RyaW5nKHFzdHJpbmcpO1xuICAgIGNmZy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGNmZy5vbmNvbnRleHRjaGFuZ2UgPSBzZXRIYXNoO1xuXG4gICAgLy8gY3JlYXRlIHRoZSBhcHBcbiAgICB3aW5kb3cubWd2ID0gbWd2ID0gbmV3IE1HVkFwcChzZWxlY3RvciwgY2ZnKTtcbiAgICBcbiAgICAvLyBoYW5kbGUgcmVzaXplIGV2ZW50c1xuICAgIHdpbmRvdy5vbnJlc2l6ZSA9ICgpID0+IHttZ3YucmVzaXplKCk7bWd2LnNldENvbnRleHQoe30pO31cbn1cblxuXG5fX21haW5fXyhcIiNtZ3ZcIik7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy92aWV3ZXIuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IENPTkZJRyAgICAgICAgICAgICAgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgcGFyc2VDb29yZHMsIGZvcm1hdENvb3JkcywgZDN0c3YsIGQzanNvbiwgaW5pdE9wdExpc3QsIHNhbWUsIGNsaXAgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IEdlbm9tZSB9ICAgICAgICAgIGZyb20gJy4vR2Vub21lJztcbmltcG9ydCB7IENvbXBvbmVudCB9ICAgICAgIGZyb20gJy4vQ29tcG9uZW50JztcbmltcG9ydCB7IEZlYXR1cmVNYW5hZ2VyIH0gIGZyb20gJy4vRmVhdHVyZU1hbmFnZXInO1xuaW1wb3J0IHsgUXVlcnlNYW5hZ2VyIH0gICAgZnJvbSAnLi9RdWVyeU1hbmFnZXInO1xuaW1wb3J0IHsgTGlzdE1hbmFnZXIgfSAgICAgZnJvbSAnLi9MaXN0TWFuYWdlcic7XG5pbXBvcnQgeyBMaXN0RWRpdG9yIH0gICAgICBmcm9tICcuL0xpc3RFZGl0b3InO1xuaW1wb3J0IHsgRmFjZXRNYW5hZ2VyIH0gICAgZnJvbSAnLi9GYWNldE1hbmFnZXInO1xuaW1wb3J0IHsgQlRNYW5hZ2VyIH0gICAgICAgZnJvbSAnLi9CVE1hbmFnZXInO1xuaW1wb3J0IHsgR2Vub21lVmlldyB9ICAgICAgZnJvbSAnLi9HZW5vbWVWaWV3JztcbmltcG9ydCB7IEZlYXR1cmVEZXRhaWxzIH0gIGZyb20gJy4vRmVhdHVyZURldGFpbHMnO1xuaW1wb3J0IHsgWm9vbVZpZXcgfSAgICAgICAgZnJvbSAnLi9ab29tVmlldyc7XG5pbXBvcnQgeyBLZXlTdG9yZSB9ICAgICAgICBmcm9tICcuL0tleVN0b3JlJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBNR1ZBcHAgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChzZWxlY3RvciwgY2ZnKSB7XG5cdHN1cGVyKG51bGwsIHNlbGVjdG9yKTtcblx0dGhpcy5nbG9iYWxDb25maWcgPSBDT05GSUc7XG5cdGNvbnNvbGUubG9nKENPTkZJRyk7XG5cdHRoaXMuYXBwID0gdGhpcztcblx0dGhpcy5uYW1lID0gQ09ORklHLk1HVkFwcC5uYW1lO1xuXHR0aGlzLnZlcnNpb24gPSBDT05GSUcuTUdWQXBwLnZlcnNpb247XG5cdC8vXG5cdHRoaXMuaW5pdGlhbENmZyA9IGNmZztcblx0Ly9cblx0dGhpcy5jb250ZXh0Q2hhbmdlZCA9IChjZmcub25jb250ZXh0Y2hhbmdlIHx8IGZ1bmN0aW9uKCl7fSk7XG5cdC8vXG5cdHRoaXMubmFtZTJnZW5vbWUgPSB7fTsgIC8vIG1hcCBmcm9tIGdlbm9tZSBuYW1lIC0+IGdlbm9tZSBkYXRhIG9ialxuXHR0aGlzLmxhYmVsMmdlbm9tZSA9IHt9OyAvLyBtYXAgZnJvbSBnZW5vbWUgbGFiZWwgLT4gZ2Vub21lIGRhdGEgb2JqXG5cdHRoaXMubmwyZ2Vub21lID0ge307ICAgIC8vIGNvbWJpbmVzIGluZGV4ZXNcblx0Ly9cblx0dGhpcy5hbGxHZW5vbWVzID0gW107ICAgLy8gbGlzdCBvZiBhbGwgYXZhaWxhYmxlIGdlbm9tZXNcblx0dGhpcy5yR2Vub21lID0gbnVsbDsgICAgLy8gdGhlIGN1cnJlbnQgcmVmZXJlbmNlIGdlbm9tZVxuXHR0aGlzLmNHZW5vbWVzID0gW107ICAgICAvLyBjdXJyZW50IGNvbXBhcmlzb24gZ2Vub21lcyAockdlbm9tZSBpcyAqbm90KiBpbmNsdWRlZCkuXG5cdHRoaXMudkdlbm9tZXMgPSBbXTtcdC8vIGxpc3Qgb2YgYWxsIGN1cnJlbnR5IHZpZXdlZCBnZW5vbWVzIChyZWYrY29tcHMpIGluIFktb3JkZXIuXG5cdC8vXG5cdHRoaXMuZHVyID0gMjUwOyAgICAgICAgIC8vIGFuaW1hdGlvbiBkdXJhdGlvbiwgaW4gbXNcblx0dGhpcy5kZWZhdWx0Wm9vbSA9IDI7XHQvLyBtdWx0aXBsaWVyIG9mIGN1cnJlbnQgcmFuZ2Ugd2lkdGguIE11c3QgYmUgPj0gMS4gMSA9PSBubyB6b29tLlxuXHRcdFx0XHQvLyAoem9vbWluZyBpbiB1c2VzIDEvdGhpcyBhbW91bnQpXG5cdHRoaXMuZGVmYXVsdFBhbiAgPSAwLjE1Oy8vIGZyYWN0aW9uIG9mIGN1cnJlbnQgcmFuZ2Ugd2lkdGhcblx0dGhpcy5jdXJyTGlzdEluZGV4ID0ge307XG5cdHRoaXMuY3Vyckxpc3RDb3VudGVyID0gMDtcblxuXG5cdC8vIENvb3JkaW5hdGVzIG1heSBiZSBzcGVjaWZpZWQgaW4gb25lIG9mIHR3byB3YXlzOiBtYXBwZWQgb3IgbGFuZG1hcmsuIFxuXHQvLyBNYXBwZWQgY29vcmRpbmF0ZXMgYXJlIHNwZWNpZmllZCBhcyBjaHJvbW9zb21lK3N0YXJ0K2VuZC4gVGhpcyBjb29yZGluYXRlIHJhbmdlIGlzIGRlZmluZWQgcmVsYXRpdmUgdG8gXG5cdC8vIHRoZSBjdXJyZW50IHJlZmVyZW5jZSBnZW5vbWUsIGFuZCBpcyBtYXBwZWQgdG8gdGhlIGNvcnJlc3BvbmRpbmcgcmFuZ2UocykgaW4gZWFjaCBjb21wYXJpc29uIGdlbm9tZS5cblx0Ly8gTGFuZG1hcmsgY29vcmRpbmF0ZXMgYXJlIHNwZWNpZmllZCBhcyBsYW5kbWFyaytbZmxhbmt8d2lkdGhdK2RlbHRhLiBUaGUgbGFuZG1hcmsgaXMgbG9va2VkIHVwIGluIGVhY2ggXG5cdC8vIGdlbm9tZS4gSXRzIGNvb3JkaW5hdGVzLCBjb21iaW5lZCB3aXRoIGZsYW5rfGxlbmd0aCBhbmQgZGVsdGEsIGRldGVybWluZSB0aGUgYWJzb2x1dGUgY29vcmRpbmF0ZSByYW5nZVxuXHQvLyBpbiB0aGF0IGdlbm9tZS4gSWYgdGhlIGxhbmRtYXJrIGRvZXMgbm90IGV4aXN0IGluIGEgZ2l2ZW4gZ2Vub21lLCB0aGVuIG1hcHBlZCBjb29yZGluYXRlIGFyZSB1c2VkLlxuXHQvLyBcblx0dGhpcy5jbW9kZSA9ICdtYXBwZWQnIC8vICdtYXBwZWQnIG9yICdsYW5kbWFyaydcblx0dGhpcy5jb29yZHMgPSB7IGNocjogJzEnLCBzdGFydDogMTAwMDAwMCwgZW5kOiAxMDAwMDAwMCB9OyAgLy8gbWFwcGVkXG5cdHRoaXMubGNvb3JkcyA9IHsgbGFuZG1hcms6ICdQYXg2JywgZmxhbms6IDUwMDAwMCwgZGVsdGE6MCB9Oy8vIGxhbmRtYXJrXG5cblx0dGhpcy5pbml0RG9tKCk7XG5cblx0Ly9cblx0Ly9cblx0dGhpcy5nZW5vbWVWaWV3ID0gbmV3IEdlbm9tZVZpZXcodGhpcywgJyNnZW5vbWVWaWV3JywgODAwLCAyNTApO1xuXHR0aGlzLnpvb21WaWV3ICAgPSBuZXcgWm9vbVZpZXcgICh0aGlzLCAnI3pvb21WaWV3JywgODAwLCAyNTAsIHRoaXMuY29vcmRzKTtcblx0dGhpcy5yZXNpemUoKTtcbiAgICAgICAgLy9cblx0dGhpcy5mZWF0dXJlRGV0YWlscyA9IG5ldyBGZWF0dXJlRGV0YWlscyh0aGlzLCAnI2ZlYXR1cmVEZXRhaWxzJyk7XG5cblx0Ly8gQ2F0ZWdvcmljYWwgY29sb3Igc2NhbGUgZm9yIGZlYXR1cmUgdHlwZXNcblx0dGhpcy5jc2NhbGUgPSBkMy5zY2FsZS5jYXRlZ29yeTEwKCkuZG9tYWluKFtcblx0ICAgICdwcm90ZWluX2NvZGluZ19nZW5lJyxcblx0ICAgICdwc2V1ZG9nZW5lJyxcblx0ICAgICduY1JOQV9nZW5lJyxcblx0ICAgICdnZW5lX3NlZ21lbnQnLFxuXHQgICAgJ290aGVyX2dlbmUnLFxuXHQgICAgJ290aGVyX2ZlYXR1cmVfdHlwZSdcblx0XSk7XG5cdC8vXG5cdC8vXG5cdHRoaXMubGlzdE1hbmFnZXIgICAgPSBuZXcgTGlzdE1hbmFnZXIodGhpcywgXCIjbXlsaXN0c1wiKTtcblx0dGhpcy5saXN0TWFuYWdlci5yZWFkeS50aGVuKCAoKSA9PiB0aGlzLmxpc3RNYW5hZ2VyLnVwZGF0ZSgpICk7XG5cdC8vXG5cdHRoaXMubGlzdEVkaXRvciA9IG5ldyBMaXN0RWRpdG9yKHRoaXMsICcjbGlzdGVkaXRvcicpO1xuXHQvL1xuXHR0aGlzLnF1ZXJ5TWFuYWdlciA9IG5ldyBRdWVyeU1hbmFnZXIodGhpcywgXCIjZmluZEdlbmVzQm94XCIpO1xuXHQvLyBcblx0dGhpcy50cmFuc2xhdG9yICAgICA9IG5ldyBCVE1hbmFnZXIodGhpcyk7XG5cdHRoaXMuZmVhdHVyZU1hbmFnZXIgPSBuZXcgRmVhdHVyZU1hbmFnZXIodGhpcyk7XG5cdC8vXG5cdHRoaXMudXNlclByZWZzU3RvcmUgPSBuZXcgS2V5U3RvcmUoXCJ1c2VyLXByZWZlcmVuY2VzXCIpO1xuXHRcblx0Ly9cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyBGYWNldHNcblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvL1xuXHR0aGlzLmZhY2V0TWFuYWdlciA9IG5ldyBGYWNldE1hbmFnZXIodGhpcyk7XG5cdGxldCBzZWxmID0gdGhpcztcblxuXHQvLyBGZWF0dXJlLXR5cGUgZmFjZXRcblx0bGV0IGZ0RmFjZXQgID0gdGhpcy5mYWNldE1hbmFnZXIuYWRkRmFjZXQoXCJGZWF0dXJlVHlwZVwiLCBmID0+IGYuZ2V0TXVuZ2VkVHlwZSgpKTtcblx0dGhpcy5pbml0RmVhdFR5cGVDb250cm9sKGZ0RmFjZXQpO1xuXG5cdC8vIEhhcy1NR0ktaWQgZmFjZXRcblx0bGV0IG1naUZhY2V0ID0gdGhpcy5mYWNldE1hbmFnZXIuYWRkRmFjZXQoXCJIYXNDYW5vbmljYWxJZFwiLCAgICBmID0+IGYuY2Fub25pY2FsICA/IFwieWVzXCIgOiBcIm5vXCIgKTtcblx0ZDMuc2VsZWN0QWxsKCdpbnB1dFtuYW1lPVwibWdpRmFjZXRcIl0nKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbigpe1xuXHQgICAgbWdpRmFjZXQuc2V0VmFsdWVzKHRoaXMudmFsdWUgPT09IFwiXCIgPyBbXSA6IFt0aGlzLnZhbHVlXSk7XG5cdCAgICBzZWxmLnpvb21WaWV3LmhpZ2hsaWdodCgpO1xuXHR9KTtcblxuXHQvLyBJcy1pbi1jdXJyZW50LWxpc3QgZmFjZXRcblx0bGV0IGluQ3Vyckxpc3RGYWNldCA9IHRoaXMuZmFjZXRNYW5hZ2VyLmFkZEZhY2V0KFwiSW5DdXJyTGlzdFwiLCBmID0+IHtcblx0ICAgIHJldHVybiB0aGlzLmN1cnJMaXN0SW5kZXhbZi5pZF0gPyBcInllc1wiIDogXCJub1wiO1xuXHR9KTtcblx0ZDMuc2VsZWN0QWxsKCdpbnB1dFtuYW1lPVwiaW5DdXJyTGlzdEZhY2V0XCJdJykub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24oKXtcblx0ICAgIGluQ3Vyckxpc3RGYWNldC5zZXRWYWx1ZXModGhpcy52YWx1ZSA9PT0gXCJcIiA/IFtdIDogW3RoaXMudmFsdWVdKTtcblx0ICAgIHNlbGYuem9vbVZpZXcuaGlnaGxpZ2h0KCk7XG5cdH0pO1xuXG5cdC8vIElzLWhpZ2hsaWdodGVkIGZhY2V0XG5cdGxldCBoaUZhY2V0ID0gdGhpcy5mYWNldE1hbmFnZXIuYWRkRmFjZXQoXCJJc0hpXCIsIGYgPT4ge1xuXHQgICAgbGV0IGlzaGkgPSB0aGlzLnpvb21WaWV3LmhpRmVhdHNbZi5pZF0gfHwgdGhpcy5jdXJyTGlzdEluZGV4W2YuaWRdO1xuXHQgICAgcmV0dXJuIGlzaGkgPyBcInllc1wiIDogXCJub1wiO1xuXHR9KTtcblx0ZDMuc2VsZWN0QWxsKCdpbnB1dFtuYW1lPVwiaGlGYWNldFwiXScpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCl7XG5cdCAgICBoaUZhY2V0LnNldFZhbHVlcyh0aGlzLnZhbHVlID09PSBcIlwiID8gW10gOiBbdGhpcy52YWx1ZV0pO1xuXHQgICAgc2VsZi56b29tVmlldy5oaWdobGlnaHQoKTtcblx0fSk7XG5cblxuXHQvL1xuXHR0aGlzLnNldFVJRnJvbVByZWZzKCk7XG5cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdC8vIFRoaW5ncyBhcmUgYWxsIHdpcmVkIHVwLiBOb3cgbGV0J3MgZ2V0IHNvbWUgZGF0YS5cblx0Ly8gU3RhcnQgd2l0aCB0aGUgZmlsZSBvZiBhbGwgdGhlIGdlbm9tZXMuXG5cdHRoaXMuY2hlY2tUaW1lc3RhbXAoKS50aGVuKCAoKSA9PiB7XG5cdCAgICBkM3RzdihcIi4vZGF0YS9nZW5vbWVkYXRhL2FsbEdlbm9tZXMudHN2XCIpLnRoZW4oZGF0YSA9PiB7XG5cdFx0Ly8gY3JlYXRlIEdlbm9tZSBvYmplY3RzIGZyb20gdGhlIHJhdyBkYXRhLlxuXHRcdHRoaXMuYWxsR2Vub21lcyAgID0gZGF0YS5tYXAoZyA9PiBuZXcgR2Vub21lKGcpKTtcblx0XHR0aGlzLmFsbEdlbm9tZXMuc29ydCggKGEsYikgPT4ge1xuXHRcdCAgICByZXR1cm4gYS5sYWJlbCA8IGIubGFiZWwgPyAtMSA6IGEubGFiZWwgPiBiLmxhYmVsID8gKzEgOiAwO1xuXHRcdH0pO1xuXHRcdC8vXG5cdFx0Ly8gYnVpbGQgYSBuYW1lLT5HZW5vbWUgaW5kZXhcblx0XHR0aGlzLm5sMmdlbm9tZSA9IHt9OyAvLyBhbHNvIGJ1aWxkIHRoZSBjb21iaW5lZCBsaXN0IGF0IHRoZSBzYW1lIHRpbWUuLi5cblx0XHR0aGlzLm5hbWUyZ2Vub21lICA9IHRoaXMuYWxsR2Vub21lc1xuXHRcdCAgICAucmVkdWNlKChhY2MsZykgPT4geyB0aGlzLm5sMmdlbm9tZVtnLm5hbWVdID0gYWNjW2cubmFtZV0gPSBnOyByZXR1cm4gYWNjOyB9LCB7fSk7XG5cdFx0Ly8gYnVpbGQgYSBsYWJlbC0+R2Vub21lIGluZGV4XG5cdFx0dGhpcy5sYWJlbDJnZW5vbWUgPSB0aGlzLmFsbEdlbm9tZXNcblx0XHQgICAgLnJlZHVjZSgoYWNjLGcpID0+IHsgdGhpcy5ubDJnZW5vbWVbZy5sYWJlbF0gPSBhY2NbZy5sYWJlbF0gPSBnOyByZXR1cm4gYWNjOyB9LCB7fSk7XG5cblx0XHQvLyBOb3cgcHJlbG9hZCBhbGwgdGhlIGNocm9tb3NvbWUgZmlsZXMgZm9yIGFsbCB0aGUgZ2Vub21lc1xuXHRcdGxldCBjZHBzID0gdGhpcy5hbGxHZW5vbWVzLm1hcChnID0+IGQzdHN2KGAuL2RhdGEvZ2Vub21lZGF0YS8ke2cubmFtZX0tY2hyb21vc29tZXMudHN2YCkpO1xuXHRcdHJldHVybiBQcm9taXNlLmFsbChjZHBzKTtcblx0ICAgIH0pXG5cdCAgICAudGhlbiggZGF0YSA9PiB7XG5cblx0XHQvL1xuXHRcdHRoaXMucHJvY2Vzc0Nocm9tb3NvbWVzKGRhdGEpO1xuXHRcdHRoaXMuaW5pdERvbVBhcnQyKCk7XG5cdFx0Ly9cblx0XHQvLyBGSU5BTExZISBXZSBhcmUgcmVhZHkgdG8gZHJhdyB0aGUgaW5pdGlhbCBzY2VuZS5cblx0XHR0aGlzLnNldENvbnRleHQodGhpcy5pbml0aWFsQ2ZnKTtcblxuXHQgICAgfSk7XG5cdH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjaGVja1RpbWVzdGFtcCAoKSB7XG4gICAgICAgIGxldCB0U3RvcmUgPSBuZXcgS2V5U3RvcmUoJ3RpbWVzdGFtcCcpO1xuXHRyZXR1cm4gZDN0c3YoJy4vZGF0YS9nZW5vbWVkYXRhL1RJTUVTVEFNUC50c3YnKS50aGVuKCB0cyA9PiB7XG5cdCAgICBsZXQgbmV3VGltZVN0YW1wID0gIG5ldyBEYXRlKERhdGUucGFyc2UodHNbMF0uVElNRVNUQU1QKSk7XG5cdCAgICByZXR1cm4gdFN0b3JlLmdldCgnVElNRVNUQU1QJykudGhlbiggb2xkVGltZVN0YW1wID0+IHtcblx0ICAgICAgICBpZiAoIW9sZFRpbWVTdGFtcCB8fCBuZXdUaW1lU3RhbXAgPiBvbGRUaW1lU3RhbXApIHtcblx0XHQgICAgdFN0b3JlLnB1dCgnVElNRVNUQU1QJyxuZXdUaW1lU3RhbXApO1xuXHRcdCAgICByZXR1cm4gdGhpcy5jbGVhckNhY2hlZERhdGEoKTtcblx0XHR9XG5cdCAgICB9KVxuXHR9KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gXG4gICAgaW5pdERvbSAoKSB7XG5cdHNlbGYgPSB0aGlzO1xuXHR0aGlzLnJvb3QgPSBkMy5zZWxlY3QoJyNtZ3YnKTtcblx0XG5cdGQzLnNlbGVjdCgnI2hlYWRlciBsYWJlbCcpXG5cdCAgICAudGV4dCh0aGlzLm5hbWUpXG5cdCAgICA7XG5cdGQzLnNlbGVjdCgnI3ZlcnNpb24nKVxuXHQgICAgLnRleHQoJ3ZlcnNpb24gJyArIHRoaXMudmVyc2lvbilcblx0ICAgIDtcblx0Ly9cblx0Ly8gVE9ETzogcmVmYWN0b3IgcGFnZWJveCwgZHJhZ2dhYmxlLCBhbmQgZnJpZW5kcyBpbnRvIGEgZnJhbWV3b3JrIG1vZHVsZSxcblx0Ly8gXG5cdHRoaXMucGJEcmFnZ2VyID0gdGhpcy5nZXRDb250ZW50RHJhZ2dlcigpO1xuXHQvLyBBZGQgYnVzeSBpY29uLCBjdXJyZW50bHkgaW52aXNpYmUuXG5cdGQzLnNlbGVjdEFsbCgnLnBhZ2Vib3gnKVxuXHQgICAgLmFwcGVuZCgnaScpXG5cdFx0LmF0dHIoJ2NsYXNzJywnbWF0ZXJpYWwtaWNvbnMgYnVzeSByb3RhdGluZycpXG5cdCAgICA7XG5cdC8vXG5cdC8vIElmIGEgcGFnZWJveCBoYXMgdGl0bGUgdGV4dCwgYXBwZW5kIGEgaGVscCBpY29uIHRvIHRoZSBsYWJlbCBhbmQgbW92ZSB0aGUgdGV4dCB0aGVyZVxuXHRkMy5zZWxlY3RBbGwoJy5wYWdlYm94W3RpdGxlXScpXG5cdCAgICAuYXBwZW5kKCdpJylcblx0ICAgICAgICAuYXR0cignY2xhc3MnLCAnbWF0ZXJpYWwtaWNvbnMgYnV0dG9uIGhlbHAnKVxuXHQgICAgICAgIC5hdHRyKCd0aXRsZScsIGZ1bmN0aW9uKCl7XG5cdFx0ICAgIGxldCBwID0gZDMuc2VsZWN0KHRoaXMucGFyZW50Tm9kZSk7XG5cdFx0ICAgIGxldCB0ID0gcC5hdHRyKCd0aXRsZScpO1xuXHRcdCAgICBwLmF0dHIoJ3RpdGxlJywgbnVsbCk7XG5cdFx0ICAgIHJldHVybiB0O1xuXHRcdH0pXG5cdFx0Lm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdCAgICBzZWxmLnNob3dTdGF0dXMoZDMuc2VsZWN0KHRoaXMpLmF0dHIoJ3RpdGxlJyksIGQzLmV2ZW50LmNsaWVudFgsIGQzLmV2ZW50LmNsaWVudFkpO1xuXHRcdH0pXG5cdFx0O1xuXHQvLyBcblx0Ly8gQWRkIG9wZW4vY2xvc2UgYnV0dG9uIHRvIGNsb3NhYmxlcyBhbmQgd2lyZSB0aGVtIHVwLlxuXHRkMy5zZWxlY3RBbGwoJy5jbG9zYWJsZScpXG5cdCAgICAuYXBwZW5kKCdpJylcblx0XHQuYXR0cignY2xhc3MnLCdtYXRlcmlhbC1pY29ucyBidXR0b24gY2xvc2UnKVxuXHRcdC5hdHRyKCd0aXRsZScsJ0NsaWNrIHRvIG9wZW4vY2xvc2UuJylcblx0XHQub24oJ2NsaWNrLmRlZmF1bHQnLCBmdW5jdGlvbiAoKSB7XG5cdFx0ICAgIGxldCBwID0gZDMuc2VsZWN0KHRoaXMucGFyZW50Tm9kZSk7XG5cdFx0ICAgIHAuY2xhc3NlZCgnY2xvc2VkJywgISBwLmNsYXNzZWQoJ2Nsb3NlZCcpKTtcblx0XHQgICAgZDMuc2VsZWN0KHRoaXMpLmF0dHIoJ3RpdGxlJywnQ2xpY2sgdG8gJyArICAocC5jbGFzc2VkKCdjbG9zZWQnKSA/ICdvcGVuJyA6ICdjbG9zZScpICsgJy4nKVxuXHRcdCAgICBzZWxmLnNldFByZWZzRnJvbVVJKCk7XG5cdFx0fSk7XG5cdC8vXG5cdC8vIFNldCB1cCBkcmFnZ2FibGVzLlxuXHRkMy5zZWxlY3RBbGwoJy5jb250ZW50LWRyYWdnYWJsZSA+IConKVxuXHQgICAgLmFwcGVuZCgnaScpXG5cdFx0LmF0dHIoJ3RpdGxlJywnRHJhZyB1cC9kb3duIHRvIHJlcG9zaXRpb24uJylcblx0XHQuYXR0cignY2xhc3MnLCdtYXRlcmlhbC1pY29ucyBidXR0b24gZHJhZ2hhbmRsZScpXG5cdFx0Lm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oKXtcblx0XHQgICAgLy8gQXR0YWNoIHRoZSBkcmFnIGJlaGF2aW9yIHdoZW4gdGhlIHVzZXIgbW91c2VzIG92ZXIgdGhlIGRyYWcgaGFuZGxlLCBhbmQgcmVtb3ZlIHRoZSBiZWhhdmlvclxuXHRcdCAgICAvLyB3aGVuIHVzZXIgbW91c2VzIG91dC4gV2h5IGRvIGl0IHRoaXMgd2F5PyBCZWNhdXNlIGlmIHRoZSBkcmFnIGJlaGF2aW9yIHN0YXlzIG9uIGFsbCB0aGUgdGltZSxcblx0XHQgICAgLy8gdGhlIHVzZXIgY2Fubm90IHNlbGVjdCBhbnkgdGV4dCB3aXRoaW4gdGhlIGJveC5cblx0XHQgICAgbGV0IHBiID0gdGhpcy5jbG9zZXN0KCcucGFnZWJveCcpO1xuXHRcdCAgICBpZiAoIXBiKSByZXR1cm47XG5cdFx0ICAgIGQzLnNlbGVjdChwYikuY2FsbChzZWxmLnBiRHJhZ2dlcik7XG5cdFx0fSlcblx0XHQub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbigpe1xuXHRcdCAgICBsZXQgcGIgPSB0aGlzLmNsb3Nlc3QoJy5wYWdlYm94Jyk7XG5cdFx0ICAgIGlmICghcGIpIHJldHVybjtcblx0XHQgICAgZDMuc2VsZWN0KHBiKS5vbignLmRyYWcnLG51bGwpO1xuXHRcdH0pO1xuXG5cdC8vIFxuICAgICAgICBkMy5zZWxlY3QoJyNzdGF0dXNNZXNzYWdlJylcblx0ICAgIC5vbignY2xpY2snLCAoKSA9PiB7IHRoaXMuc2hvd1N0YXR1cyhmYWxzZSk7IH0pO1xuXHRcblx0Ly9cblx0Ly8gQnV0dG9uOiBHZWFyIGljb24gdG8gc2hvdy9oaWRlIGxlZnQgY29sdW1uXG5cdGQzLnNlbGVjdChcIiNoZWFkZXIgPiAuZ2Vhci5idXR0b25cIilcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0ICAgICAgICBsZXQgbGMgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImxlZnRjb2x1bW5cIl0nKTtcblx0XHRsYy5jbGFzc2VkKFwiY2xvc2VkXCIsICgpID0+ICEgbGMuY2xhc3NlZChcImNsb3NlZFwiKSk7XG5cdFx0d2luZG93LnNldFRpbWVvdXQoKCk9Pntcblx0XHQgICAgdGhpcy5yZXNpemUoKVxuXHRcdCAgICB0aGlzLnNldENvbnRleHQoe30pO1xuXHRcdCAgICB0aGlzLnNldFByZWZzRnJvbVVJKCk7XG5cdFx0fSwgMjUwKTtcblx0ICAgIH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBEb20gaW5pdGlhbGl6dGlvbiB0aGF0IG11c3Qgd2FpdCB1bnRpbCBhZnRlciBnZW5vbWUgbWV0YSBkYXRhIGlzIGxvYWRlZC5cbiAgICBpbml0RG9tUGFydDIgKCkge1xuXHQvL1xuXHRsZXQgY2ZnID0gdGhpcy5zYW5pdGl6ZUNmZyh0aGlzLmluaXRpYWxDZmcpO1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cblx0Ly8gaW5pdGlhbGl6ZSB0aGUgcmVmIGFuZCBjb21wIGdlbm9tZSBvcHRpb24gbGlzdHNcblx0aW5pdE9wdExpc3QoXCIjcmVmR2Vub21lXCIsICAgdGhpcy5hbGxHZW5vbWVzLCBnPT5nLm5hbWUsIGc9PmcubGFiZWwsIGZhbHNlLCBnID0+IGcgPT09IGNmZy5yZWYpO1xuXHRpbml0T3B0TGlzdChcIiNjb21wR2Vub21lc1wiLCB0aGlzLmFsbEdlbm9tZXMsIGc9PmcubmFtZSwgZz0+Zy5sYWJlbCwgdHJ1ZSwgIGcgPT4gY2ZnLmdlbm9tZXMuaW5kZXhPZihnKSAhPT0gLTEpO1xuXHRkMy5zZWxlY3QoXCIjcmVmR2Vub21lXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xuXHQgICAgc2VsZi5zZXRDb250ZXh0KHsgcmVmOiB0aGlzLnZhbHVlIH0pO1xuXHR9KTtcblx0ZDMuc2VsZWN0KFwiI2NvbXBHZW5vbWVzXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xuXHQgICAgbGV0IHNlbGVjdGVkTmFtZXMgPSBbXTtcblx0ICAgIGZvcihsZXQgeCBvZiB0aGlzLnNlbGVjdGVkT3B0aW9ucyl7XG5cdFx0c2VsZWN0ZWROYW1lcy5wdXNoKHgudmFsdWUpO1xuXHQgICAgfVxuXHQgICAgLy8gd2FudCB0byBwcmVzZXJ2ZSBjdXJyZW50IGdlbm9tZSBvcmRlciBhcyBtdWNoIGFzIHBvc3NpYmxlIFxuXHQgICAgbGV0IGdOYW1lcyA9IHNlbGYudkdlbm9tZXMubWFwKGc9PmcubmFtZSlcblx0XHQuZmlsdGVyKG4gPT4ge1xuXHRcdCAgICByZXR1cm4gc2VsZWN0ZWROYW1lcy5pbmRleE9mKG4pID49IDAgfHwgbiA9PT0gc2VsZi5yR2Vub21lLm5hbWU7XG5cdFx0fSk7XG5cdCAgICBnTmFtZXMgPSBnTmFtZXMuY29uY2F0KHNlbGVjdGVkTmFtZXMuZmlsdGVyKG4gPT4gZ05hbWVzLmluZGV4T2YobikgPT09IC0xKSk7XG5cdCAgICBzZWxmLnNldENvbnRleHQoeyBnZW5vbWVzOiBnTmFtZXMgfSk7XG5cdH0pO1xuXHRkM3RzdihcIi4vZGF0YS9nZW5vbWVkYXRhL2dlbm9tZVNldHMudHN2XCIpLnRoZW4oc2V0cyA9PiB7XG5cdCAgICAvLyBDcmVhdGUgc2VsZWN0aW9uIGJ1dHRvbnMuXG5cdCAgICBzZXRzLmZvckVhY2goIHMgPT4gcy5nZW5vbWVzID0gcy5nZW5vbWVzLnNwbGl0KFwiLFwiKSApO1xuXHQgICAgbGV0IGNnYiA9IGQzLnNlbGVjdCgnI2NvbXBHZW5vbWVzQm94Jykuc2VsZWN0QWxsKCdidXR0b24nKS5kYXRhKHNldHMpO1xuXHQgICAgY2diLmVudGVyKCkuYXBwZW5kKCdidXR0b24nKVxuXHRcdC50ZXh0KGQ9PmQubmFtZSlcblx0XHQuYXR0cigndGl0bGUnLCBkPT5kLmRlc2NyaXB0aW9uKVxuXHRcdC5vbignY2xpY2snLCBkID0+IHtcblx0XHQgICAgc2VsZi5zZXRDb250ZXh0KGQpO1xuXHRcdH0pXG5cdFx0O1xuXHR9KS5jYXRjaCgoKT0+e1xuXHQgICAgY29uc29sZS5sb2coXCJObyBnZW5vbWVTZXRzIGZpbGUgZm91bmQuXCIpO1xuXHR9KTsgLy8gT0sgaWYgbm8gZ2Vub21lU2V0cyBmaWxlXG5cbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcHJvY2Vzc0Nocm9tb3NvbWVzIChkYXRhKSB7XG5cdC8vIGRhdGEgaXMgYSBsaXN0IG9mIGNocm9tb3NvbWUgbGlzdHMsIG9uZSBwZXIgZ2Vub21lXG5cdC8vIEZpbGwgaW4gdGhlIGdlbm9tZUNocnMgbWFwIChnZW5vbWUgLT4gY2hyIGxpc3QpXG5cdHRoaXMuYWxsR2Vub21lcy5mb3JFYWNoKChnLGkpID0+IHtcblx0ICAgIC8vIG5pY2VseSBzb3J0IHRoZSBjaHJvbW9zb21lc1xuXHQgICAgbGV0IGNocnMgPSBkYXRhW2ldO1xuXHQgICAgZy5tYXhsZW4gPSAwO1xuXHQgICAgY2hycy5mb3JFYWNoKCBjID0+IHtcblx0XHQvL1xuXHRcdGMubGVuZ3RoID0gcGFyc2VJbnQoYy5sZW5ndGgpXG5cdFx0Zy5tYXhsZW4gPSBNYXRoLm1heChnLm1heGxlbiwgYy5sZW5ndGgpO1xuXHRcdC8vIGJlY2F1c2UgSSdkIHJhdGhlciBzYXkgXCJjaHJvbW9zb21lLm5hbWVcIiB0aGFuIFwiY2hyb21vc29tZS5jaHJvbW9zb21lXCJcblx0XHRjLm5hbWUgPSBjLmNocm9tb3NvbWU7XG5cdFx0ZGVsZXRlIGMuY2hyb21vc29tZTtcblx0ICAgIH0pO1xuXHQgICAgLy8gbmljZWx5IHNvcnQgdGhlIGNocm9tb3NvbWVzXG5cdCAgICBjaHJzLnNvcnQoKGEsYikgPT4ge1xuXHRcdGxldCBhYSA9IHBhcnNlSW50KGEubmFtZSkgLSBwYXJzZUludChiLm5hbWUpO1xuXHRcdGlmICghaXNOYU4oYWEpKSByZXR1cm4gYWE7XG5cdFx0cmV0dXJuIGEubmFtZSA8IGIubmFtZSA/IC0xIDogYS5uYW1lID4gYi5uYW1lID8gKzEgOiAwO1xuXHQgICAgfSk7XG5cdCAgICBnLmNocm9tb3NvbWVzID0gY2hycztcblx0fSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldENvbnRlbnREcmFnZ2VyICgpIHtcbiAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgIC8vIEhlbHBlciBmdW5jdGlvbiBmb3IgdGhlIGRyYWcgYmVoYXZpb3IuIFJlb3JkZXJzIHRoZSBjb250ZW50cyBiYXNlZCBvblxuICAgICAgLy8gY3VycmVudCBzY3JlZW4gcG9zaXRpb24gb2YgdGhlIGRyYWdnZWQgaXRlbS5cbiAgICAgIGZ1bmN0aW9uIHJlb3JkZXJCeURvbSgpIHtcblx0ICAvLyBMb2NhdGUgdGhlIHNpYiB3aG9zZSBwb3NpdGlvbiBpcyBiZXlvbmQgdGhlIGRyYWdnZWQgaXRlbSBieSB0aGUgbGVhc3QgYW1vdW50XG5cdCAgbGV0IGRyID0gc2VsZi5kcmFnZ2luZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICBsZXQgYlNpYiA9IG51bGw7XG5cdCAgbGV0IHh5ID0gZDMuc2VsZWN0KHNlbGYuZHJhZ1BhcmVudCkuY2xhc3NlZChcImZsZXhyb3dcIikgPyBcInhcIiA6IFwieVwiO1xuXHQgIGZvciAobGV0IHMgb2Ygc2VsZi5kcmFnU2licykge1xuXHQgICAgICBsZXQgc3IgPSBzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgICAgICBpZiAoZHJbeHldIDwgc3JbeHldKSB7XG5cdFx0ICAgbGV0IGRpc3QgPSBzclt4eV0gLSBkclt4eV07XG5cdFx0ICAgaWYgKCFiU2liIHx8IGRpc3QgPCBiU2liW3h5XSAtIGRyW3h5XSlcblx0XHQgICAgICAgYlNpYiA9IHM7XG5cdCAgICAgIH1cblx0ICB9XG5cdCAgLy8gSW5zZXJ0IHRoZSBkcmFnZ2VkIGl0ZW0gYmVmb3JlIHRoZSBsb2NhdGVkIHNpYiAob3IgYXBwZW5kIGlmIG5vIHNpYiBmb3VuZClcblx0ICBzZWxmLmRyYWdQYXJlbnQuaW5zZXJ0QmVmb3JlKHNlbGYuZHJhZ2dpbmcsIGJTaWIpO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gcmVvcmRlckJ5U3R5bGUoKSB7XG5cdCAgbGV0IGRkID0gZDMuc2VsZWN0KHNlbGYuZHJhZ2dpbmcpO1xuXHQgIC8vIExvY2F0ZSB0aGUgc2liIHRoYXQgY29udGFpbnMgdGhlIGRyYWdnZWQgaXRlbSdzIG9yaWdpbi5cblx0ICBsZXQgZHIgPSBzZWxmLmRyYWdnaW5nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgIGxldCBiU2liID0gbnVsbDtcblx0ICBsZXQgeHkgPSBkMy5zZWxlY3Qoc2VsZi5kcmFnUGFyZW50KS5jbGFzc2VkKFwiZmxleHJvd1wiKSA/IFwieFwiIDogXCJ5XCI7XG5cdCAgbGV0IHN6ID0geHkgPT09IFwieFwiID8gXCJ3aWR0aFwiIDogXCJoZWlnaHRcIjtcblx0ICBsZXQgc3R5PSB4eSA9PT0gXCJ4XCIgPyBcImxlZnRcIiA6IFwidG9wXCI7XG5cdCAgZm9yIChsZXQgcyBvZiBzZWxmLmRyYWdTaWJzKSB7XG5cdCAgICAgIC8vIHNraXAgdGhlIGRyYWdnZWQgaXRlbVxuXHQgICAgICBpZiAocyA9PT0gc2VsZi5kcmFnZ2luZykgY29udGludWU7XG5cdCAgICAgIGxldCBkcyA9IGQzLnNlbGVjdChzKTtcblx0ICAgICAgbGV0IHNyID0gcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICAgICAgLy8gaWZ3IHRoZSBkcmFnZ2VkIGl0ZW0ncyBvcmlnaW4gaXMgYmV0d2VlbiB0aGUgc3RhcnQgYW5kIGVuZCBvZiBzaWIsIHdlIGZvdW5kIGl0LlxuXHQgICAgICBpZiAoZHJbeHldID49IHNyW3h5XSAmJiBkclt4eV0gPD0gKHNyW3h5XSArIHNyW3N6XSkpIHtcblx0XHQgICAvLyBtb3ZlIHNpYiB0b3dhcmQgdGhlIGhvbGUsIGFtb3VudCA9IHRoZSBzaXplIG9mIHRoZSBob2xlXG5cdFx0ICAgbGV0IGFtdCA9IHNlbGYuZHJhZ0hvbGVbc3pdICogKHNlbGYuZHJhZ0hvbGVbeHldIDwgc3JbeHldID8gLTEgOiAxKTtcblx0XHQgICBkcy5zdHlsZShzdHksIHBhcnNlSW50KGRzLnN0eWxlKHN0eSkpICsgYW10ICsgXCJweFwiKTtcblx0XHQgICBzZWxmLmRyYWdIb2xlW3h5XSAtPSBhbXQ7XG4gICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgIH1cblx0ICB9XG4gICAgICB9XG4gICAgICAvL1xuICAgICAgcmV0dXJuIGQzLmJlaGF2aW9yLmRyYWcoKVxuXHQgIC5vcmlnaW4oZnVuY3Rpb24oZCxpKXtcblx0ICAgICAgcmV0dXJuIHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgfSlcbiAgICAgICAgICAub24oXCJkcmFnc3RhcnQubVwiLCBmdW5jdGlvbigpIHtcblx0ICAgICAgbGV0IHQgPSBkMy5ldmVudC5zb3VyY2VFdmVudC50YXJnZXQ7XG5cdCAgICAgIGlmICghIGQzLnNlbGVjdCh0KS5jbGFzc2VkKFwiZHJhZ2hhbmRsZVwiKSkgcmV0dXJuO1xuXHQgICAgICBkMy5ldmVudC5zb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICAgICAgLy9cblx0ICAgICAgc2VsZi5kcmFnZ2luZyAgICA9IHRoaXMuY2xvc2VzdChcIi5wYWdlYm94XCIpO1xuXHQgICAgICBzZWxmLmRyYWdIb2xlICAgID0gc2VsZi5kcmFnZ2luZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICAgICAgc2VsZi5kcmFnUGFyZW50ICA9IHNlbGYuZHJhZ2dpbmcucGFyZW50Tm9kZTtcblx0ICAgICAgc2VsZi5kcmFnU2licyAgICA9IHNlbGYuZHJhZ1BhcmVudC5jaGlsZHJlbjtcblx0ICAgICAgLy9cblx0ICAgICAgZDMuc2VsZWN0KHNlbGYuZHJhZ2dpbmcpLmNsYXNzZWQoXCJkcmFnZ2luZ1wiLCB0cnVlKTtcblx0ICB9KVxuXHQgIC5vbihcImRyYWcubVwiLCBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIGlmICghc2VsZi5kcmFnZ2luZykgcmV0dXJuO1xuXHQgICAgICBsZXQgZGQgPSBkMy5zZWxlY3Qoc2VsZi5kcmFnZ2luZyk7XG5cdCAgICAgIGxldCB0cCA9IHBhcnNlSW50KGRkLnN0eWxlKFwidG9wXCIpKVxuXHQgICAgICBkZC5zdHlsZShcInRvcFwiLCB0cCArIGQzLmV2ZW50LmR5ICsgXCJweFwiKTtcblx0ICAgICAgLy9yZW9yZGVyQnlTdHlsZSgpO1xuXHQgIH0pXG5cdCAgLm9uKFwiZHJhZ2VuZC5tXCIsIGZ1bmN0aW9uICgpIHtcblx0ICAgICAgaWYgKCFzZWxmLmRyYWdnaW5nKSByZXR1cm47XG5cdCAgICAgIHJlb3JkZXJCeURvbSgpO1xuXHQgICAgICBzZWxmLnNldFByZWZzRnJvbVVJKCk7XG5cdCAgICAgIGxldCBkZCA9IGQzLnNlbGVjdChzZWxmLmRyYWdnaW5nKTtcblx0ICAgICAgZGQuc3R5bGUoXCJ0b3BcIiwgXCIwcHhcIik7XG5cdCAgICAgIGRkLmNsYXNzZWQoXCJkcmFnZ2luZ1wiLCBmYWxzZSk7XG5cdCAgICAgIHNlbGYuZHJhZ2dpbmcgICAgPSBudWxsO1xuXHQgICAgICBzZWxmLmRyYWdIb2xlICAgID0gbnVsbDtcblx0ICAgICAgc2VsZi5kcmFnUGFyZW50ICA9IG51bGw7XG5cdCAgICAgIHNlbGYuZHJhZ1NpYnMgICAgPSBudWxsO1xuXHQgIH0pXG5cdCAgO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzZXRVSUZyb21QcmVmcyAoKSB7XG5cdHRoaXMudXNlclByZWZzU3RvcmUuZ2V0KFwicHJlZnNcIikudGhlbiggcHJlZnMgPT4ge1xuXHQgICAgcHJlZnMgPSBwcmVmcyB8fCB7fTtcblx0ICAgIGNvbnNvbGUubG9nKFwiR290IHByZWZzIGZyb20gc3RvcmFnZVwiLCBwcmVmcyk7XG5cblx0ICAgIC8vIHNldCBvcGVuL2Nsb3NlZCBzdGF0ZXNcblx0ICAgIChwcmVmcy5jbG9zYWJsZXMgfHwgW10pLmZvckVhY2goIGMgPT4ge1xuXHRcdGxldCBpZCA9IGNbMF07XG5cdFx0bGV0IHN0YXRlID0gY1sxXTtcblx0XHRkMy5zZWxlY3QoJyMnK2lkKS5jbGFzc2VkKCdjbG9zZWQnLCBzdGF0ZSA9PT0gXCJjbG9zZWRcIiB8fCBudWxsKTtcblx0ICAgIH0pO1xuXG5cdCAgICAvLyBzZXQgZHJhZ2dhYmxlcycgb3JkZXJcblx0ICAgIChwcmVmcy5kcmFnZ2FibGVzIHx8IFtdKS5mb3JFYWNoKCBkID0+IHtcblx0XHRsZXQgY3RySWQgPSBkWzBdO1xuXHRcdGxldCBjb250ZW50SWRzID0gZFsxXTtcblx0XHRsZXQgY3RyID0gZDMuc2VsZWN0KCcjJytjdHJJZCk7XG5cdFx0bGV0IGNvbnRlbnRzID0gY3RyLnNlbGVjdEFsbCgnIycrY3RySWQrJyA+IConKTtcblx0XHRjb250ZW50c1swXS5zb3J0KCAoYSxiKSA9PiB7XG5cdFx0ICAgIGxldCBhaSA9IGNvbnRlbnRJZHMuaW5kZXhPZihhLmdldEF0dHJpYnV0ZSgnaWQnKSk7XG5cdFx0ICAgIGxldCBiaSA9IGNvbnRlbnRJZHMuaW5kZXhPZihiLmdldEF0dHJpYnV0ZSgnaWQnKSk7XG5cdFx0ICAgIHJldHVybiBhaSA9PT0gLTEgPyAxIDogYmkgPT09IC0xID8gLTEgOiBhaSAtIGJpO1xuXHRcdH0pO1xuXHRcdGNvbnRlbnRzLm9yZGVyKCk7XG5cdCAgICB9KTtcblx0fSk7XG4gICAgfVxuICAgIHNldFByZWZzRnJvbVVJICgpIHtcbiAgICAgICAgLy8gc2F2ZSBvcGVuL2Nsb3NlZCBzdGF0ZXNcblx0bGV0IGNsb3NhYmxlcyA9IHRoaXMucm9vdC5zZWxlY3RBbGwoJy5jbG9zYWJsZScpO1xuXHRsZXQgb2NEYXRhID0gY2xvc2FibGVzWzBdLm1hcCggYyA9PiB7XG5cdCAgICBsZXQgZGMgPSBkMy5zZWxlY3QoYyk7XG5cdCAgICByZXR1cm4gW2RjLmF0dHIoJ2lkJyksIGRjLmNsYXNzZWQoXCJjbG9zZWRcIikgPyBcImNsb3NlZFwiIDogXCJvcGVuXCJdO1xuXHR9KTtcblx0Ly8gc2F2ZSBkcmFnZ2FibGVzJyBvcmRlclxuXHRsZXQgZHJhZ0N0cnMgPSB0aGlzLnJvb3Quc2VsZWN0QWxsKCcuY29udGVudC1kcmFnZ2FibGUnKTtcblx0bGV0IGRyYWdnYWJsZXMgPSBkcmFnQ3Rycy5zZWxlY3RBbGwoJy5jb250ZW50LWRyYWdnYWJsZSA+IConKTtcblx0bGV0IGRkRGF0YSA9IGRyYWdnYWJsZXMubWFwKCAoZCxpKSA9PiB7XG5cdCAgICBsZXQgY3RyID0gZDMuc2VsZWN0KGRyYWdDdHJzWzBdW2ldKTtcblx0ICAgIHJldHVybiBbY3RyLmF0dHIoJ2lkJyksIGQubWFwKCBkZCA9PiBkMy5zZWxlY3QoZGQpLmF0dHIoJ2lkJykpXTtcblx0fSk7XG5cdGxldCBwcmVmcyA9IHtcblx0ICAgIGNsb3NhYmxlczogb2NEYXRhLFxuXHQgICAgZHJhZ2dhYmxlczogZGREYXRhXG5cdH1cblx0Y29uc29sZS5sb2coXCJTYXZpbmcgcHJlZnMgdG8gc3RvcmFnZVwiLCBwcmVmcyk7XG5cdHRoaXMudXNlclByZWZzU3RvcmUuc2V0KFwicHJlZnNcIiwgcHJlZnMpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzaG93QmxvY2tzIChjb21wKSB7XG5cdGxldCByZWYgPSB0aGlzLnJHZW5vbWU7XG5cdGlmICghIGNvbXApIGNvbXAgPSB0aGlzLmNHZW5vbWVzWzBdO1xuXHRpZiAoISBjb21wKSByZXR1cm47XG5cdHRoaXMudHJhbnNsYXRvci5yZWFkeSgpLnRoZW4oICgpID0+IHtcblx0ICAgIGxldCBibG9ja3MgPSBjb21wID09PSByZWYgPyBbXSA6IHRoaXMudHJhbnNsYXRvci5nZXRCbG9ja3MocmVmLCBjb21wKTtcblx0ICAgIHRoaXMuZ2Vub21lVmlldy5kcmF3QmxvY2tzKHsgcmVmLCBjb21wLCBibG9ja3MgfSk7XG5cdH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzaG93QnVzeSAoaXNCdXN5LCBtZXNzYWdlKSB7XG4gICAgICAgIGQzLnNlbGVjdChcIiNoZWFkZXIgPiAuZ2Vhci5idXR0b25cIilcblx0ICAgIC5jbGFzc2VkKFwicm90YXRpbmdcIiwgaXNCdXN5KTtcbiAgICAgICAgZDMuc2VsZWN0KFwiI3pvb21WaWV3XCIpLmNsYXNzZWQoXCJidXN5XCIsIGlzQnVzeSk7XG5cdGlmIChpc0J1c3kgJiYgbWVzc2FnZSkgdGhpcy5zaG93U3RhdHVzKG1lc3NhZ2UpO1xuXHRpZiAoIWlzQnVzeSkgdGhpcy5zaG93U3RhdHVzKCcnKVxuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzaG93aW5nU3RhdHVzICgpIHtcbiAgICAgICAgcmV0dXJuIGQzLnNlbGVjdCgnI3N0YXR1c01lc3NhZ2UnKS5jbGFzc2VkKCdzaG93aW5nJyk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2hvd1N0YXR1cyAobXNnLCBuZWFyWCwgbmVhclkpIHtcblx0bGV0IGJiID0gdGhpcy5yb290Lm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0bGV0IF8gPSAobiwgbGVuLCBubWF4KSA9PiB7XG5cdCAgICBpZiAobiA9PT0gdW5kZWZpbmVkKVxuXHQgICAgICAgIHJldHVybiAnNTAlJztcblx0ICAgIGVsc2UgaWYgKHR5cGVvZihuKSA9PT0gJ3N0cmluZycpXG5cdCAgICAgICAgcmV0dXJuIG47XG5cdCAgICBlbHNlIGlmICggbiArIGxlbiA8IG5tYXggKSB7XG5cdCAgICAgICAgcmV0dXJuIG4gKyAncHgnO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgICAgcmV0dXJuIChubWF4IC0gbGVuKSArICdweCc7XG5cdCAgICB9XG5cdH07XG5cdG5lYXJYID0gXyhuZWFyWCwgMjUwLCBiYi53aWR0aCk7XG5cdG5lYXJZID0gXyhuZWFyWSwgMTUwLCBiYi5oZWlnaHQpO1xuXHRpZiAobXNnKVxuXHQgICAgZDMuc2VsZWN0KCcjc3RhdHVzTWVzc2FnZScpXG5cdFx0LmNsYXNzZWQoJ3Nob3dpbmcnLCB0cnVlKVxuXHRcdC5zdHlsZSgnbGVmdCcsIG5lYXJYKVxuXHRcdC5zdHlsZSgndG9wJywgIG5lYXJZKVxuXHRcdC5zZWxlY3QoJ3NwYW4nKVxuXHRcdCAgICAudGV4dChtc2cpO1xuXHRlbHNlXG5cdCAgICBkMy5zZWxlY3QoJyNzdGF0dXNNZXNzYWdlJykuY2xhc3NlZCgnc2hvd2luZycsIGZhbHNlKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzZXRSZWZHZW5vbWVTZWxlY3Rpb24gKCkge1xuXHRkMy5zZWxlY3RBbGwoXCIjcmVmR2Vub21lIG9wdGlvblwiKVxuXHQgICAgLnByb3BlcnR5KFwic2VsZWN0ZWRcIiwgIGdnID0+IChnZy5sYWJlbCA9PT0gdGhpcy5yR2Vub21lLmxhYmVsICB8fCBudWxsKSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNldENvbXBHZW5vbWVzU2VsZWN0aW9uICgpIHtcblx0bGV0IGNnbnMgPSB0aGlzLnZHZW5vbWVzLm1hcChnPT5nLmxhYmVsKTtcblx0ZDMuc2VsZWN0QWxsKFwiI2NvbXBHZW5vbWVzIG9wdGlvblwiKVxuXHQgICAgICAgIC5wcm9wZXJ0eShcInNlbGVjdGVkXCIsICBnZyA9PiBjZ25zLmluZGV4T2YoZ2cubGFiZWwpID49IDApO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTZXRzIG9yIHJldHVybnNcbiAgICBzZXRIaWdobGlnaHQgKGZsaXN0KSB7XG5cdGlmICghZmxpc3QpIHJldHVybiBmYWxzZTtcblx0dGhpcy56b29tVmlldy5oaUZlYXRzID0gZmxpc3QucmVkdWNlKChhLHYpID0+IHsgYVt2XT12OyByZXR1cm4gYTsgfSwge30pO1xuXHRyZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyB0aGUgY3VycmVudCBjb250ZXh0IGFzIGFuIG9iamVjdC5cbiAgICAvLyBDdXJyZW50IGNvbnRleHQgPSByZWYgZ2Vub21lICsgY29tcCBnZW5vbWVzICsgY3VycmVudCByYW5nZSAoY2hyLHN0YXJ0LGVuZClcbiAgICBnZXRDb250ZXh0ICgpIHtcblx0aWYgKHRoaXMuY21vZGUgPT09ICdtYXBwZWQnKSB7XG5cdCAgICBsZXQgYyA9IHRoaXMuY29vcmRzO1xuXHQgICAgcmV0dXJuIHtcblx0XHRyZWYgOiB0aGlzLnJHZW5vbWUubGFiZWwsXG5cdFx0Z2Vub21lczogdGhpcy52R2Vub21lcy5tYXAoZz0+Zy5sYWJlbCksXG5cdFx0Y2hyOiBjLmNocixcblx0XHRzdGFydDogYy5zdGFydCxcblx0XHRlbmQ6IGMuZW5kLFxuXHRcdGhpZ2hsaWdodDogT2JqZWN0LmtleXModGhpcy56b29tVmlldy5oaUZlYXRzKS5zb3J0KCksXG5cdFx0ZG1vZGU6IHRoaXMuem9vbVZpZXcuZG1vZGVcblx0ICAgIH1cblx0fSBlbHNlIHtcblx0ICAgIGxldCBjID0gdGhpcy5sY29vcmRzO1xuXHQgICAgcmV0dXJuIHtcblx0XHRyZWYgOiB0aGlzLnJHZW5vbWUubGFiZWwsXG5cdFx0Z2Vub21lczogdGhpcy52R2Vub21lcy5tYXAoZz0+Zy5sYWJlbCksXG5cdFx0bGFuZG1hcms6IGMubGFuZG1hcmssXG5cdFx0Zmxhbms6IGMuZmxhbmssXG5cdFx0bGVuZ3RoOiBjLmxlbmd0aCxcblx0XHRkZWx0YTogYy5kZWx0YSxcblx0XHRoaWdobGlnaHQ6IE9iamVjdC5rZXlzKHRoaXMuem9vbVZpZXcuaGlGZWF0cykuc29ydCgpLFxuXHRcdGRtb2RlOiB0aGlzLnpvb21WaWV3LmRtb2RlXG5cdCAgICB9XG5cdH1cbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmVzb2x2ZXMgdGhlIHNwZWNpZmllZCBsYW5kbWFyayB0byBhIGZlYXR1cmUgYW5kIHRoZSBsaXN0IG9mIGVxdWl2YWxlbnQgZmVhdXJlcy5cbiAgICAvLyBNYXkgYmUgZ2l2ZW4gYW4gaWQsIGNhbm9uaWNhbCBpZCwgb3Igc3ltYm9sLlxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgIGNmZyAob2JqKSBTYW5pdGl6ZWQgY29uZmlnIG9iamVjdCwgd2l0aCBhIGxhbmRtYXJrIChzdHJpbmcpIGZpZWxkLlxuICAgIC8vIFJldHVybnM6XG4gICAgLy8gICAgIFRoZSBjZmcgb2JqZWN0LCB3aXRoIGFkZGl0aW9uYWwgZmllbGRzOlxuICAgIC8vICAgICAgICBsYW5kbWFya1JlZkZlYXQ6IHRoZSBsYW5kbWFyayAoRmVhdHVyZSBvYmopIGluIHRoZSByZWYgZ2Vub21lXG4gICAgLy8gICAgICAgIGxhbmRtYXJrRmVhdHM6IFsgZXF1aXZhbGVudCBmZWF0dXJlcyBpbiBlYWNoIGdlbm9tZSAoaW5jbHVkZXMgcmYpXVxuICAgIC8vICAgICBBbHNvLCBjaGFuZ2VzIHJlZiB0byBiZSB0aGUgZ2Vub21lIG9mIHRoZSBsYW5kbWFya1JlZkZlYXRcbiAgICAvLyAgICAgUmV0dXJucyBudWxsIGlmIGxhbmRtYXJrIG5vdCBmb3VuZCBpbiBhbnkgZ2Vub21lLlxuICAgIC8vIFxuICAgIHJlc29sdmVMYW5kbWFyayAoY2ZnKSB7XG5cdGxldCByZiwgZmVhdHM7XG5cdC8vIEZpbmQgdGhlIGxhbmRtYXJrIGZlYXR1cmUgaW4gdGhlIHJlZiBnZW5vbWUuIFxuXHRyZiA9IHRoaXMuZmVhdHVyZU1hbmFnZXIuZ2V0Q2FjaGVkRmVhdHVyZXNCeUxhYmVsKGNmZy5sYW5kbWFyaywgY2ZnLnJlZilbMF07XG5cdGlmICghcmYpIHtcblx0ICAgIC8vIExhbmRtYXJrIGRvZXMgbm90IGV4aXN0IGluIHJlZiBnZW5vbWUuIERvZXMgaXQgZXhpc3QgaW4gYW55IHNwZWNpZmllZCBnZW5vbWU/XG5cdCAgICByZiA9IHRoaXMuZmVhdHVyZU1hbmFnZXIuZ2V0Q2FjaGVkRmVhdHVyZXNCeUxhYmVsKGNmZy5sYW5kbWFyaykuZmlsdGVyKGYgPT4gY2ZnLmdlbm9tZXMuaW5kZXhPZihmLmdlbm9tZSkgPj0gMClbMF07XG5cdCAgICBpZiAocmYpIHtcblx0ICAgICAgICBjZmcucmVmID0gcmYuZ2Vub21lO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdCAgICAgICAgLy8gTGFuZG1hcmsgY2Fubm90IGJlIHJlc29sdmVkLlxuXHRcdHJldHVybiBudWxsO1xuXHQgICAgfVxuXHR9XG5cdC8vIGxhbmRtYXJrIGV4aXN0cyBpbiByZWYgZ2Vub21lLiBHZXQgZXF1aXZhbGVudCBmZWF0IGluIGVhY2ggZ2Vub21lLlxuXHRmZWF0cyA9IHJmLmNhbm9uaWNhbCA/IHRoaXMuZmVhdHVyZU1hbmFnZXIuZ2V0Q2FjaGVkRmVhdHVyZXNCeUNhbm9uaWNhbElkKHJmLmNhbm9uaWNhbCkgOiBbcmZdO1xuXHRjZmcubGFuZG1hcmtSZWZGZWF0ID0gcmY7XG5cdGNmZy5sYW5kbWFya0ZlYXRzID0gZmVhdHMuZmlsdGVyKGYgPT4gY2ZnLmdlbm9tZXMuaW5kZXhPZihmLmdlbm9tZSkgPj0gMCk7XG5cdHJldHVybiBjZmc7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYSBzYW5pdGl6ZWQgdmVyc2lvbiBvZiB0aGUgYXJndW1lbnQgY29uZmlndXJhdGlvbiBvYmplY3QuXG4gICAgLy8gVGhlIHNhbml0aXplZCB2ZXJzaW9uOlxuICAgIC8vICAgICAtIGhhcyBhIHNldHRpbmcgZm9yIGV2ZXJ5IHBhcmFtZXRlci4gUGFyYW1ldGVycyBub3Qgc3BlY2lmaWVkIGluIFxuICAgIC8vICAgICAgIHRoZSBhcmd1bWVudCBhcmUgKGdlbmVyYWxseSkgZmlsbGVkIGluIHdpdGggdGhlaXIgY3VycmVudCB2YWx1ZXMuXG4gICAgLy8gICAgIC0gaXMgYWx3YXlzIHZhbGlkLCBlZ1xuICAgIC8vICAgICBcdC0gaGFzIGEgbGlzdCBvZiAxIG9yIG1vcmUgdmFsaWQgZ2Vub21lcywgd2l0aCBvbmUgb2YgdGhlbSBkZXNpZ25hdGVkIGFzIHRoZSByZWZcbiAgICAvLyAgICAgXHQtIGhhcyBhIHZhbGlkIGNvb3JkaW5hdGUgcmFuZ2VcbiAgICAvLyAgICAgXHQgICAgLSBzdGFydCBhbmQgZW5kIGFyZSBpbnRlZ2VycyB3aXRoIHN0YXJ0IDw9IGVuZFxuICAgIC8vICAgICBcdCAgICAtIHZhbGlkIGNocm9tb3NvbWUgZm9yIHJlZiBnZW5vbWVcbiAgICAvL1xuICAgIC8vIFRoZSBzYW5pdGl6ZWQgdmVyc2lvbiBpcyBhbHNvIFwiY29tcGlsZWRcIjpcbiAgICAvLyAgICAgLSBpdCBoYXMgYWN0dWFsIEdlbm9tZSBvYmplY3RzLCB3aGVyZSB0aGUgYXJndW1lbnQganVzdCBoYXMgbmFtZXNcbiAgICAvLyAgICAgLSBncm91cHMgdGhlIGNocitzdGFydCtlbmQgaW4gXCJjb29yZHNcIiBvYmplY3RcbiAgICAvL1xuICAgIC8vXG4gICAgc2FuaXRpemVDZmcgKGMpIHtcblx0bGV0IGNmZyA9IHt9O1xuXG5cdC8vIFNhbml0aXplIHRoZSBpbnB1dC5cblxuXHQvLyB3aW5kb3cgc2l6ZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRpZiAoYy53aWR0aCkge1xuXHQgICAgY2ZnLndpZHRoID0gYy53aWR0aFxuXHR9XG5cblx0Ly8gcmVmIGdlbm9tZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly9cblx0Ly8gU2V0IGNmZy5yZWYgdG8gc3BlY2lmaWVkIGdlbm9tZSwgXG5cdC8vICAgd2l0aCBmYWxsYmFjayB0byBjdXJyZW50IHJlZiBnZW5vbWUsIFxuXHQvLyAgICAgIHdpdGggZmFsbGJhY2sgdG8gQzU3QkwvNkogKDFzdCB0aW1lIHRocnUpXG5cdC8vIEZJWE1FOiBmaW5hbCBmYWxsYmFjayBzaG91bGQgYmUgYSBjb25maWcgc2V0dGluZy5cblx0Y2ZnLnJlZiA9IChjLnJlZiA/IHRoaXMubmwyZ2Vub21lW2MucmVmXSB8fCB0aGlzLnJHZW5vbWUgOiB0aGlzLnJHZW5vbWUpIHx8IHRoaXMubmwyZ2Vub21lWydDNTdCTC82SiddO1xuXG5cdC8vIGNvbXBhcmlzb24gZ2Vub21lcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIFNldCBjZmcuZ2Vub21lcyB0byBiZSB0aGUgc3BlY2lmaWVkIGdlbm9tZXMsXG5cdC8vICAgICB3aXRoIGZhbGxiYWNrIHRvIHRoZSBjdXJyZW50IGdlbm9tZXNcblx0Ly8gICAgICAgIHdpdGggZmFsbGJhY2sgdG8gW3JlZl0gKDFzdCB0aW1lIHRocnUpXG5cdGNmZy5nZW5vbWVzID0gYy5nZW5vbWVzID9cblx0ICAgIChjLmdlbm9tZXMubWFwKGcgPT4gdGhpcy5ubDJnZW5vbWVbZ10pLmZpbHRlcih4PT54KSlcblx0ICAgIDpcblx0ICAgIHRoaXMudkdlbm9tZXM7XG5cdC8vIEFkZCByZWYgdG8gZ2Vub21lcyBpZiBub3QgdGhlcmUgYWxyZWFkeVxuXHRpZiAoY2ZnLmdlbm9tZXMuaW5kZXhPZihjZmcucmVmKSA9PT0gLTEpXG5cdCAgICBjZmcuZ2Vub21lcy51bnNoaWZ0KGNmZy5yZWYpO1xuXHRcblx0Ly8gYWJzb2x1dGUgY29vcmRpbmF0ZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly9cblx0Ly8gU2V0IGNmZy5jaHIgdG8gYmUgdGhlIHNwZWNpZmllZCBjaHJvbW9zb21lXG5cdC8vICAgICB3aXRoIGZhbGxiYWNrIHRvIHRoZSBjdXJyZW50IGNoclxuXHQvLyAgICAgICAgIHdpdGggZmFsbGJhY2sgdG8gdGhlIDFzdCBjaHJvbW9zb21lIGluIHRoZSByZWYgZ2Vub21lXG5cdGNmZy5jaHIgPSBjZmcucmVmLmdldENocm9tb3NvbWUoYy5jaHIpO1xuXHRpZiAoIWNmZy5jaHIpIGNmZy5jaHIgPSBjZmcucmVmLmdldENocm9tb3NvbWUoIHRoaXMuY29vcmRzID8gdGhpcy5jb29yZHMuY2hyIDogXCIxXCIgKTtcblx0aWYgKCFjZmcuY2hyKSBjZmcuY2hyID0gY2ZnLnJlZi5nZXRDaHJvbW9zb21lKDApO1xuXHRpZiAoIWNmZy5jaHIpIHRocm93IFwiTm8gY2hyb21vc29tZS5cIlxuXHRcblx0Ly8gU2V0IGNmZy5zdGFydCB0byBiZSB0aGUgc3BlY2lmaWVkIHN0YXJ0IHdpdGggZmFsbGJhY2sgdG8gdGhlIGN1cnJlbnQgc3RhcnRcblx0Ly8gQ2xpcCBhdCBjaHIgYm91bmRhcmllc1xuXHRjZmcuc3RhcnQgPSBjbGlwKE1hdGgucm91bmQodHlwZW9mKGMuc3RhcnQpID09PSBcIm51bWJlclwiID8gYy5zdGFydCA6IHRoaXMuY29vcmRzLnN0YXJ0KSwgMSwgY2ZnLmNoci5sZW5ndGgpO1xuXG5cdC8vIFNldCBjZmcuZW5kIHRvIGJlIHRoZSBzcGVjaWZpZWQgZW5kIHdpdGggZmFsbGJhY2sgdG8gdGhlIGN1cnJlbnQgZW5kXG5cdC8vIENsaXAgYXQgY2hyIGJvdW5kYXJpZXNcblx0Y2ZnLmVuZCA9IGNsaXAoTWF0aC5yb3VuZCh0eXBlb2YoYy5lbmQpID09PSBcIm51bWJlclwiID8gYy5lbmQgOiB0aGlzLmNvb3Jkcy5lbmQpLCAxLCBjZmcuY2hyLmxlbmd0aCk7XG5cblx0Ly8gRW5zdXJlIHN0YXJ0IDw9IGVuZFxuXHRpZiAoY2ZnLnN0YXJ0ID4gY2ZnLmVuZCkge1xuXHQgICBsZXQgdG1wID0gY2ZnLnN0YXJ0OyBjZmcuc3RhcnQgPSBjZmcuZW5kOyBjZmcuZW5kID0gdG1wO1xuXHR9XG5cblx0Ly8gbGFuZG1hcmsgY29vcmRpbmF0ZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gTk9URSB0aGF0IGxhbmRtYXJrIGNvb3JkaW5hdGUgY2Fubm90IGJlIGZ1bGx5IHJlc29sdmVkIHRvIGFic29sdXRlIGNvb3JkaW5hdGUgdW50aWxcblx0Ly8gKmFmdGVyKiBnZW5vbWUgZGF0YSBoYXZlIGJlZW4gbG9hZGVkLiBTZWUgc2V0Q29udGV4dCBhbmQgcmVzb2x2ZUxhbmRtYXJrIG1ldGhvZHMuXG5cdGNmZy5sYW5kbWFyayA9IGMubGFuZG1hcmsgfHwgdGhpcy5sY29vcmRzLmxhbmRtYXJrO1xuXHRjZmcuZGVsdGEgICAgPSBNYXRoLnJvdW5kKCdkZWx0YScgaW4gYyA/IGMuZGVsdGEgOiAodGhpcy5sY29vcmRzLmRlbHRhIHx8IDApKTtcblx0aWYgKHR5cGVvZihjLmZsYW5rKSA9PT0gJ251bWJlcicpe1xuXHQgICAgY2ZnLmZsYW5rID0gTWF0aC5yb3VuZChjLmZsYW5rKTtcblx0fVxuXHRlbHNlIGlmICgnbGVuZ3RoJyBpbiBjKSB7XG5cdCAgICBjZmcubGVuZ3RoID0gTWF0aC5yb3VuZChjLmxlbmd0aCk7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICBjZmcubGVuZ3RoID0gTWF0aC5yb3VuZCh0aGlzLmNvb3Jkcy5lbmQgLSB0aGlzLmNvb3Jkcy5zdGFydCArIDEpO1xuXHR9XG5cblx0Ly8gY21vZGUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0aWYgKGMuY21vZGUgJiYgYy5jbW9kZSAhPT0gJ21hcHBlZCcgJiYgYy5jbW9kZSAhPT0gJ2xhbmRtYXJrJykgYy5jbW9kZSA9IG51bGw7XG5cdGNmZy5jbW9kZSA9IGMuY21vZGUgfHwgXG5cdCAgICAoKCdjaHInIGluIGMgfHwgJ3N0YXJ0JyBpbiBjIHx8ICdlbmQnIGluIGMpID9cblx0ICAgICAgICAnbWFwcGVkJyA6IFxuXHRcdCgnbGFuZG1hcmsnIGluIGMgfHwgJ2ZsYW5rJyBpbiBjIHx8ICdsZW5ndGgnIGluIGMgfHwgJ2RlbHRhJyBpbiBjKSA/XG5cdFx0ICAgICdsYW5kbWFyaycgOiBcblx0XHQgICAgdGhpcy5jbW9kZSB8fCAnbWFwcGVkJyk7XG5cblx0Ly8gaGlnaGxpZ2h0aW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gU2V0IGNmZy5oaWdobGlnaHRcblx0Ly8gICAgd2l0aCBmYWxsYmFjayB0byBjdXJyZW50IGhpZ2hsaWdodFxuXHQvLyAgICAgICAgd2l0aCBmYWxsYmFjayB0byBbXVxuXHRjZmcuaGlnaGxpZ2h0ID0gYy5oaWdobGlnaHQgfHwgdGhpcy56b29tVmlldy5oaWdobGlnaHRlZCB8fCBbXTtcblxuXHQvLyBkcmF3aW5nIG1vZGUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyBTZXQgdGhlIGRyYXdpbmcgbW9kZSBmb3IgdGhlIFpvb21WaWV3LlxuXHQvLyAgICAgd2l0aCBmYWxsYmFjayB0byB0aGUgY3VycmVudCB2YWx1ZVxuXHRpZiAoYy5kbW9kZSA9PT0gJ2NvbXBhcmlzb24nIHx8IGMuZG1vZGUgPT09ICdyZWZlcmVuY2UnKSBcblx0ICAgIGNmZy5kbW9kZSA9IGMuZG1vZGU7XG5cdGVsc2Vcblx0ICAgIGNmZy5kbW9kZSA9IHRoaXMuem9vbVZpZXcuZG1vZGUgfHwgJ2NvbXBhcmlzb24nO1xuXG5cdC8vXG5cdHJldHVybiBjZmc7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gU2V0cyB0aGUgY3VycmVudCBjb250ZXh0IGZyb20gdGhlIGNvbmZpZyBvYmplY3QuIFxuICAgIC8vIE9ubHkgdGhvc2UgY29udGV4dCBpdGVtcyBzcGVjaWZpZWQgaW4gdGhlIGNvbmZpZyBhcmUgYWZmZWN0ZWQsIGV4Y2VwdCBhcyBub3RlZC5cbiAgICAvL1xuICAgIC8vIEFsbCBjb25maWdzIGFyZSBzYW5pdGl6ZWQgYmVmb3JlIGJlaW5nIGFwcGxpZWQgKHNlZSBzYW5pdGl6ZUNmZykuXG4gICAgLy8gXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICBjIChvYmplY3QpIEEgY29uZmlndXJhdGlvbiBvYmplY3QgdGhhdCBzcGVjaWZpZXMgc29tZS9hbGwgY29uZmlnIHZhbHVlcy5cbiAgICAvLyAgICAgICAgIFRoZSBwb3NzaWJsZSBjb25maWcgaXRlbXM6XG4gICAgLy8gICAgICAgICAgICBnZW5vbWVzICAgKGxpc3QgbyBzdHJpbmdzKSBBbGwgdGhlIGdlbm9tZXMgeW91IHdhbnQgdG8gc2VlLCBpbiB0b3AtdG8tYm90dG9tIG9yZGVyLiBcbiAgICAvLyAgICAgICAgICAgICAgIE1heSB1c2UgaW50ZXJuYWwgbmFtZXMgb3IgZGlzcGxheSBsYWJlbHMsIGVnLCBcIm11c19tdXNjdWx1c18xMjlzMXN2aW1qXCIgb3IgXCIxMjlTMS9TdkltSlwiLlxuICAgIC8vICAgICAgICAgICAgcmVmICAgICAgIChzdHJpbmcpIFRoZSBnZW5vbWUgdG8gdXNlIGFzIHRoZSByZWZlcmVuY2UuIE1heSBiZSBuYW1lIG9yIGxhYmVsLlxuICAgIC8vICAgICAgICAgICAgaGlnaGxpZ2h0IChsaXN0IG8gc3RyaW5ncykgSURzIG9mIGZlYXR1cmVzIHRvIGhpZ2hsaWdodFxuICAgIC8vICAgICAgICAgICAgZG1vZGUgICAgIChzdHJpbmcpIGVpdGhlciAnY29tcGFyaXNvbicgb3IgJ3JlZmVyZW5jZSdcbiAgICAvL1xuICAgIC8vICAgICAgICAgICAgQ29vcmRpbmF0ZXMgYXJlIHNwZWNpZmllZCBpbiBvbmUgb2YgMiBmb3Jtcy5cbiAgICAvLyAgICAgICAgICAgICAgY2hyICAgICAgIChzdHJpbmcpIENocm9tb3NvbWUgZm9yIGNvb3JkaW5hdGUgcmFuZ2VcbiAgICAvLyAgICAgICAgICAgICAgc3RhcnQgICAgIChpbnQpIENvb3JkaW5hdGUgcmFuZ2Ugc3RhcnQgcG9zaXRpb25cbiAgICAvLyAgICAgICAgICAgICAgZW5kICAgICAgIChpbnQpIENvb3JkaW5hdGUgcmFuZ2UgZW5kIHBvc2l0aW9uXG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgICAgRGlzcGxheXMgdGhpcyBjb29yZGluYXRlIHJhbmdlIGZyb20gdGhlIGN1cnJlbnQgcmVmZXJlbmNlIGdlbmVvbXMsIGFuZCB0aGUgZXF1aXZhbGVudCAobWFwcGVkKVxuICAgIC8vICAgICAgICAgICAgICBjb29yZGluYXRlIHJhbmdlKHMpIGluIGVhY2ggY29tcGFyaXNvbiBnZW5vbWUuXG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgIG9yOlxuICAgIC8vICAgICAgICAgICAgICBsYW5kbWFyayAgKHN0cmluZykgSUQsIGNhbm9uaWNhbCBJRCwgb3Igc3ltYm9sLCBpZGVudGlmeWluZyBhIGZlYXR1cmUuXG4gICAgLy8gICAgICAgICAgICAgIGZsYW5rfGxlbmd0aCAoaW50KSBJZiBmbGFuaywgdmlld2luZyByZWdpb24gc2l6ZSA9IGZsYW5rICsgbGVuKGxhbmRtYXJrKSArIGZsYW5rLiBcbiAgICAvLyAgICAgICAgICAgICAgICAgSWYgbGVuZ3RoLCB2aWV3aW5nIHJlZ2lvbiBzaXplID0gbGVuZ3RoLiBJbiBlaXRoZXIgY2FzZSwgdGhlIGxhbmRtYXJrIGlzIGNlbnRlcmVkIGluXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoZSB2aWV3aW5nIGFyZWEsICsvLSBhbnkgc3BlY2lmaWVkIGRlbHRhLlxuICAgIC8vICAgICAgICAgICAgICBkZWx0YSAgICAgKGludCkgQW1vdW50IGluIGJwIHRvIHNoaWZ0IHRoZSByZWdpb24gbGVmdCAoPDApIG9yIHJpZ2h0ICg+MCkuXG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgICAgRGlzcGxheXMgdGhlIHJlZ2lvbiBhcm91bmQgdGhlIHNwZWNpZmllZCBsYW5kbWFyayBpbiBlYWNoIGdlbm9tZSB3aGVyZSBpdCBleGlzdHMuXG4gICAgLy9cbiAgICAvLyAgICBxdWlldGx5IChib29sZWFuKSBJZiB0cnVlLCBkb24ndCB1cGRhdGUgYnJvd3NlciBoaXN0b3J5IChhcyB3aGVuIGdvaW5nIGJhY2spXG4gICAgLy9cbiAgICAvLyBSZXR1cm5zOlxuICAgIC8vICAgIE5vdGhpbmdcbiAgICAvLyBTaWRlIGVmZmVjdHM6XG4gICAgLy9cdCAgUmVkcmF3cyBcbiAgICAvL1x0ICBDYWxscyBjb250ZXh0Q2hhbmdlZCgpIFxuICAgIC8vXG4gICAgc2V0Q29udGV4dCAoYywgcXVpZXRseSkge1xuICAgICAgICBsZXQgY2ZnID0gdGhpcy5zYW5pdGl6ZUNmZyhjKTtcblx0Ly9jb25zb2xlLmxvZyhcIlNldCBjb250ZXh0IChyYXcpOlwiLCBjKTtcblx0Ly9jb25zb2xlLmxvZyhcIlNldCBjb250ZXh0IChzYW5pdGl6ZWQpOlwiLCBjZmcpO1xuXHRpZiAoIWNmZykgcmV0dXJuO1xuXHR0aGlzLnNob3dCdXN5KHRydWUsICdSZXF1ZXN0aW5nIGRhdGEuLi4nKTtcblx0bGV0IHAgPSB0aGlzLmZlYXR1cmVNYW5hZ2VyLmxvYWRHZW5vbWVzKGNmZy5nZW5vbWVzKS50aGVuKCgpID0+IHtcblx0ICAgIGlmIChjZmcuY21vZGUgPT09ICdsYW5kbWFyaycpIHtcblx0ICAgICAgICBjZmcgPSB0aGlzLnJlc29sdmVMYW5kbWFyayhjZmcpO1xuXHRcdGlmICghY2ZnKSB7XG5cdFx0ICAgIGFsZXJ0KFwiTGFuZG1hcmsgZG9lcyBub3QgZXhpc3QgaW4gY3VycmVudCByZWZlcmVuY2UgZ2Vub21lLiBQbGVhc2UgY2hhbmdlIHRoZSByZWZlcmVuY2UgZ2Vub21lIGFuZCB0cnkgYWdhaW4uXCIpO1xuXHRcdCAgICB0aGlzLnNob3dCdXN5KGZhbHNlKTtcblx0XHQgICAgcmV0dXJuO1xuXHRcdH1cblx0ICAgIH1cblx0ICAgIHRoaXMudkdlbm9tZXMgPSBjZmcuZ2Vub21lcztcblx0ICAgIHRoaXMuckdlbm9tZSAgPSBjZmcucmVmO1xuXHQgICAgdGhpcy5jR2Vub21lcyA9IGNmZy5nZW5vbWVzLmZpbHRlcihnID0+IGcgIT09IGNmZy5yZWYpO1xuXHQgICAgdGhpcy5zZXRSZWZHZW5vbWVTZWxlY3Rpb24odGhpcy5yR2Vub21lLm5hbWUpO1xuXHQgICAgdGhpcy5zZXRDb21wR2Vub21lc1NlbGVjdGlvbih0aGlzLnZHZW5vbWVzLm1hcChnPT5nLm5hbWUpKTtcblx0ICAgIC8vXG5cdCAgICB0aGlzLmNtb2RlID0gY2ZnLmNtb2RlO1xuXHQgICAgLy9cblx0ICAgIHJldHVybiB0aGlzLnRyYW5zbGF0b3IucmVhZHkoKTtcblx0fSkudGhlbigoKSA9PiB7XG5cdCAgICAvL1xuXHQgICAgaWYgKCFjZmcpIHJldHVybjtcblx0ICAgIHRoaXMuY29vcmRzICAgPSB7XG5cdFx0Y2hyOiBjZmcuY2hyLm5hbWUsXG5cdFx0Y2hyb21vc29tZTogY2ZnLmNocixcblx0XHRzdGFydDogY2ZnLnN0YXJ0LFxuXHRcdGVuZDogY2ZnLmVuZFxuXHQgICAgfTtcblx0ICAgIHRoaXMubGNvb3JkcyAgPSB7XG5cdCAgICAgICAgbGFuZG1hcms6IGNmZy5sYW5kbWFyaywgXG5cdFx0bGFuZG1hcmtSZWZGZWF0OiBjZmcubGFuZG1hcmtSZWZGZWF0LFxuXHRcdGxhbmRtYXJrRmVhdHM6IGNmZy5sYW5kbWFya0ZlYXRzLFxuXHRcdGZsYW5rOiBjZmcuZmxhbmssIFxuXHRcdGxlbmd0aDogY2ZnLmxlbmd0aCwgXG5cdFx0ZGVsdGE6IGNmZy5kZWx0YSBcblx0ICAgIH07XG5cdCAgICAvL1xuXHQgICAgdGhpcy56b29tVmlldy51cGRhdGUoY2ZnKTtcblx0ICAgIC8vXG5cdCAgICB0aGlzLmdlbm9tZVZpZXcucmVkcmF3KCk7XG5cdCAgICB0aGlzLmdlbm9tZVZpZXcuc2V0QnJ1c2hDb29yZHModGhpcy5jb29yZHMpO1xuXHQgICAgLy9cblx0ICAgIGlmICghcXVpZXRseSlcblx0ICAgICAgICB0aGlzLmNvbnRleHRDaGFuZ2VkKCk7XG5cdCAgICAvL1xuXHQgICAgdGhpcy5zaG93QnVzeShmYWxzZSk7XG5cdH0pO1xuXHRyZXR1cm4gcDtcbiAgICB9XG4gXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2V0Q29vcmRpbmF0ZXMgKHN0cikge1xuXHRsZXQgY29vcmRzID0gcGFyc2VDb29yZHMoc3RyKTtcblx0aWYgKCEgY29vcmRzKSB7XG5cdCAgICBsZXQgZmVhdHMgPSB0aGlzLmZlYXR1cmVNYW5hZ2VyLmdldENhY2hlZEZlYXR1cmVzQnlMYWJlbChzdHIpO1xuXHQgICAgbGV0IGZlYXRzMiA9IGZlYXRzLmZpbHRlcihmPT5mLmdlbm9tZSA9PSB0aGlzLnJHZW5vbWUpO1xuXHQgICAgbGV0IGYgPSBmZWF0czJbMF0gfHwgZmVhdHNbMF07XG5cdCAgICBpZiAoZikge1xuXHRcdGNvb3JkcyA9IHtcblx0XHQgICAgcmVmOiBmLmdlbm9tZS5uYW1lLFxuXHRcdCAgICBsYW5kbWFyazogc3RyLFxuXHRcdCAgICBkZWx0YTogMCxcblx0XHQgICAgaGlnaGxpZ2h0OiBmLmlkXG5cdFx0fVxuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdFx0YWxlcnQoXCJVbmFibGUgdG8gc2V0IGNvb3JkaW5hdGVzIHdpdGggdGhpcyB2YWx1ZTogXCIgKyBzdHIpO1xuXHRcdHJldHVybjtcblx0ICAgIH1cblx0fVxuXHR0aGlzLnNldENvbnRleHQoY29vcmRzKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICByZXNpemUgKCkge1xuXHRsZXQgdyA9IHdpbmRvdy5pbm5lcldpZHRoIC0gMjQ7XG5cdHRoaXMuZ2Vub21lVmlldy5maXRUb1dpZHRoKHcpO1xuXHR0aGlzLnpvb21WaWV3LmZpdFRvV2lkdGgodyk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgdGhlIGN1cnJlbnQgY29udGV4dCBhcyBhIHBhcmFtZXRlciBzdHJpbmdcbiAgICAvLyBDdXJyZW50IGNvbnRleHQgPSByZWYgZ2Vub21lICsgY29tcCBnZW5vbWVzICsgY3VycmVudCByYW5nZSAoY2hyLHN0YXJ0LGVuZClcbiAgICBnZXRQYXJhbVN0cmluZyAoKSB7XG5cdGxldCBjID0gdGhpcy5nZXRDb250ZXh0KCk7XG4gICAgICAgIGxldCByZWYgPSBgcmVmPSR7Yy5yZWZ9YDtcbiAgICAgICAgbGV0IGdlbm9tZXMgPSBgZ2Vub21lcz0ke2MuZ2Vub21lcy5qb2luKFwiK1wiKX1gO1xuXHRsZXQgY29vcmRzID0gYGNocj0ke2MuY2hyfSZzdGFydD0ke2Muc3RhcnR9JmVuZD0ke2MuZW5kfWA7XG5cdGxldCBsZmxmID0gYy5mbGFuayA/ICcmZmxhbms9JytjLmZsYW5rIDogJyZsZW5ndGg9JytjLmxlbmd0aDtcblx0bGV0IGxjb29yZHMgPSBgbGFuZG1hcms9JHtjLmxhbmRtYXJrfSZkZWx0YT0ke2MuZGVsdGF9JHtsZmxmfWA7XG5cdGxldCBobHMgPSBgaGlnaGxpZ2h0PSR7Yy5oaWdobGlnaHQuam9pbihcIitcIil9YDtcblx0bGV0IGRtb2RlID0gYGRtb2RlPSR7Yy5kbW9kZX1gO1xuXHRyZXR1cm4gYCR7dGhpcy5jbW9kZT09PSdtYXBwZWQnP2Nvb3JkczpsY29vcmRzfSYke2Rtb2RlfSYke3JlZn0mJHtnZW5vbWVzfSYke2hsc31gO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldEN1cnJlbnRMaXN0ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3Vyckxpc3Q7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNldEN1cnJlbnRMaXN0IChsc3QsIGdvVG9GaXJzdCkge1xuICAgIFx0Ly9cblx0bGV0IHByZXZMaXN0ID0gdGhpcy5jdXJyTGlzdDtcblx0dGhpcy5jdXJyTGlzdCA9IGxzdDtcblx0aWYgKGxzdCAhPT0gcHJldkxpc3QpIHtcblx0ICAgIHRoaXMuY3Vyckxpc3RJbmRleCA9IGxzdCA/IGxzdC5pZHMucmVkdWNlKCAoeCxpKSA9PiB7IHhbaV09aTsgcmV0dXJuIHg7IH0sIHt9KSA6IHt9O1xuXHQgICAgdGhpcy5jdXJyTGlzdENvdW50ZXIgPSAwO1xuXHR9XG5cdC8vXG5cdGxldCBsaXN0cyA9IGQzLnNlbGVjdCgnI215bGlzdHMnKS5zZWxlY3RBbGwoJy5saXN0SW5mbycpO1xuXHRsaXN0cy5jbGFzc2VkKFwiY3VycmVudFwiLCBkID0+IGQgPT09IGxzdCk7XG5cdC8vXG5cdC8vIHNob3cgdGhpcyBsaXN0IGFzIHRpY2sgbWFya3MgaW4gdGhlIGdlbm9tZSB2aWV3XG5cdHRoaXMuZ2Vub21lVmlldy5kcmF3VGlja3MobHN0ID8gbHN0LmlkcyA6IFtdKTtcblx0dGhpcy5nZW5vbWVWaWV3LmRyYXdUaXRsZSgpO1xuXHR0aGlzLnpvb21WaWV3LmhpZ2hsaWdodCgpO1xuXHQvL1xuXHRpZiAoZ29Ub0ZpcnN0KSB0aGlzLmdvVG9OZXh0TGlzdEVsZW1lbnQoKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ29Ub05leHRMaXN0RWxlbWVudCAoKSB7XG5cdGlmICghdGhpcy5jdXJyTGlzdCB8fCB0aGlzLmN1cnJMaXN0Lmlkcy5sZW5ndGggPT09IDApIHJldHVybjtcblx0bGV0IGN1cnJJZCA9IHRoaXMuY3Vyckxpc3QuaWRzW3RoaXMuY3Vyckxpc3RDb3VudGVyXTtcbiAgICAgICAgdGhpcy5jdXJyTGlzdENvdW50ZXIgPSAodGhpcy5jdXJyTGlzdENvdW50ZXIgKyAxKSAlIHRoaXMuY3Vyckxpc3QuaWRzLmxlbmd0aDtcblx0dGhpcy5zZXRDb29yZGluYXRlcyhjdXJySWQpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBwYW56b29tKHBmYWN0b3IsIHpmYWN0b3IpIHtcblx0Ly9cblx0IXBmYWN0b3IgJiYgKHBmYWN0b3IgPSAwKTtcblx0IXpmYWN0b3IgJiYgKHpmYWN0b3IgPSAxKTtcblx0Ly9cblx0bGV0IGMgPSB0aGlzLmNvb3Jkcztcblx0bGV0IHdpZHRoID0gYy5lbmQgLSBjLnN0YXJ0ICsgMTtcblx0bGV0IG1pZCA9IChjLnN0YXJ0ICsgYy5lbmQpLzI7XG5cdGxldCBjaHIgPSB0aGlzLnJHZW5vbWUuY2hyb21vc29tZXMuZmlsdGVyKGMgPT4gYy5uYW1lID09PSB0aGlzLmNvb3Jkcy5jaHIpWzBdO1xuXHRsZXQgbmN4dCA9IHt9OyAvLyBuZXcgY29udGV4dFxuXHRsZXQgbWluRCA9IC0oYy5zdGFydC0xKTsgLy8gbWluIGRlbHRhIChhdCBjdXJyZW50IHpvb20pXG5cdGxldCBtYXhEID0gY2hyLmxlbmd0aCAtIGMuZW5kOyAvLyBtYXggZGVsdGEgKGF0IGN1cnJlbnQgem9vbSlcblx0bGV0IGQgPSBjbGlwKHBmYWN0b3IgKiB3aWR0aCwgbWluRCwgbWF4RCk7IC8vIGRlbHRhIChhdCBuZXcgem9vbSlcblx0bGV0IG5ld3dpZHRoID0gemZhY3RvciAqIHdpZHRoO1xuXHRsZXQgbmV3c3RhcnQgPSBtaWQgLSBuZXd3aWR0aC8yICsgZDtcblx0Ly9cblx0aWYgKHRoaXMuY21vZGUgPT09ICdtYXBwZWQnKSB7XG5cdCAgICBuY3h0LmNociA9IGMuY2hyO1xuXHQgICAgbmN4dC5zdGFydCA9IG5ld3N0YXJ0O1xuXHQgICAgbmN4dC5lbmQgPSBuZXdzdGFydCArIG5ld3dpZHRoIC0gMTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIG5jeHQubGVuZ3RoID0gbmV3d2lkdGg7XG5cdCAgICBuY3h0LmRlbHRhID0gdGhpcy5sY29vcmRzLmRlbHRhICsgZCA7XG5cdH1cblx0dGhpcy5zZXRDb250ZXh0KG5jeHQpO1xuICAgIH1cbiAgICB6b29tIChmYWN0b3IpIHtcbiAgICAgICAgdGhpcy5wYW56b29tKG51bGwsIGZhY3Rvcik7XG4gICAgfVxuICAgIHBhbiAoZmFjdG9yKSB7XG4gICAgICAgIHRoaXMucGFuem9vbShmYWN0b3IsIG51bGwpO1xuICAgIH1cdFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFpvb21zIGluL291dCBieSBmYWN0b3IuIE5ldyB6b29tIHdpZHRoIGlzIGZhY3RvciAqIHRoZSBjdXJyZW50IHdpZHRoLlxuICAgIC8vIEZhY3RvciA+IDEgem9vbXMgb3V0LCAwIDwgZmFjdG9yIDwgMSB6b29tcyBpbi5cbiAgICB4em9vbSAoZmFjdG9yKSB7XG5cdGxldCBsZW4gPSB0aGlzLmNvb3Jkcy5lbmQgLSB0aGlzLmNvb3Jkcy5zdGFydCArIDE7XG5cdGxldCBuZXdsZW4gPSBNYXRoLnJvdW5kKGZhY3RvciAqIGxlbik7XG5cdGxldCB4ID0gKHRoaXMuY29vcmRzLnN0YXJ0ICsgdGhpcy5jb29yZHMuZW5kKS8yO1xuXHRpZiAodGhpcy5jbW9kZSA9PT0gJ21hcHBlZCcpIHtcblx0ICAgIGxldCBuZXdzdGFydCA9IE1hdGgucm91bmQoeCAtIG5ld2xlbi8yKTtcblx0ICAgIHRoaXMuc2V0Q29udGV4dCh7IGNocjogdGhpcy5jb29yZHMuY2hyLCBzdGFydDogbmV3c3RhcnQsIGVuZDogbmV3c3RhcnQgKyBuZXdsZW4gLSAxIH0pO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgdGhpcy5zZXRDb250ZXh0KHsgbGVuZ3RoOiBuZXdsZW4gfSk7XG5cdH1cbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBQYW5zIHRoZSB2aWV3IGxlZnQgb3IgcmlnaHQgYnkgZmFjdG9yLiBUaGUgZGlzdGFuY2UgbW92ZWQgaXMgZmFjdG9yIHRpbWVzIHRoZSBjdXJyZW50IHpvb20gd2lkdGguXG4gICAgLy8gTmVnYXRpdmUgdmFsdWVzIHBhbiBsZWZ0LiBQb3NpdGl2ZSB2YWx1ZXMgcGFuIHJpZ2h0LiAoTm90ZSB0aGF0IHBhbm5pbmcgbW92ZXMgdGhlIFwiY2FtZXJhXCIuIFBhbm5pbmcgdG8gdGhlXG4gICAgLy8gcmlnaHQgbWFrZXMgdGhlIG9iamVjdHMgaW4gdGhlIHNjZW5lIGFwcGVhciB0byBtb3ZlIHRvIHRoZSBsZWZ0LCBhbmQgdmljZSB2ZXJzYS4pXG4gICAgLy9cbiAgICB4cGFuIChmYWN0b3IpIHtcblx0bGV0IGMgPSB0aGlzLmNvb3Jkcztcblx0bGV0IGNociA9IHRoaXMuckdlbm9tZS5jaHJvbW9zb21lcy5maWx0ZXIoYyA9PiBjLm5hbWUgPT09IHRoaXMuY29vcmRzLmNocilbMF07XG5cdGxldCB3aWR0aCA9IGMuZW5kIC0gYy5zdGFydCArIDE7XG5cdGxldCBtaW5EID0gLShjLnN0YXJ0LTEpO1xuXHRsZXQgbWF4RCA9IGNoci5sZW5ndGggLSBjLmVuZDtcblx0bGV0IGQgPSBjbGlwKGZhY3RvciAqIHdpZHRoLCBtaW5ELCBtYXhEKTtcblx0aWYgKHRoaXMuY21vZGUgPT09ICdtYXBwZWQnKSB7XG5cdCAgICB0aGlzLnNldENvbnRleHQoeyBjaHI6IGMuY2hyLCBzdGFydDogYy5zdGFydCtkLCBlbmQ6IGMuZW5kK2QgfSk7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICB0aGlzLnNldENvbnRleHQoeyBkZWx0YTogdGhpcy5sY29vcmRzLmRlbHRhICsgZCB9KTtcblx0fVxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGluaXRGZWF0VHlwZUNvbnRyb2wgKGZhY2V0KSB7XG5cdGxldCBzZWxmID0gdGhpcztcblx0bGV0IGNvbG9ycyA9IHRoaXMuY3NjYWxlLmRvbWFpbigpLm1hcChsYmwgPT4ge1xuXHQgICAgcmV0dXJuIHsgbGJsOmxibCwgY2xyOnRoaXMuY3NjYWxlKGxibCkgfTtcblx0fSk7XG5cdGxldCBja2VzID0gZDMuc2VsZWN0KFwiLmNvbG9yS2V5XCIpXG5cdCAgICAuc2VsZWN0QWxsKCcuY29sb3JLZXlFbnRyeScpXG5cdFx0LmRhdGEoY29sb3JzKTtcblx0bGV0IG5jcyA9IGNrZXMuZW50ZXIoKS5hcHBlbmQoXCJkaXZcIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJjb2xvcktleUVudHJ5IGZsZXhyb3dcIik7XG5cdG5jcy5hcHBlbmQoXCJkaXZcIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIixcInN3YXRjaFwiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsIGMgPT4gYy5sYmwpXG5cdCAgICAuc3R5bGUoXCJiYWNrZ3JvdW5kLWNvbG9yXCIsIGMgPT4gYy5jbHIpXG5cdCAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG5cdFx0bGV0IHQgPSBkMy5zZWxlY3QodGhpcyk7XG5cdCAgICAgICAgdC5jbGFzc2VkKFwiY2hlY2tlZFwiLCAhIHQuY2xhc3NlZChcImNoZWNrZWRcIikpO1xuXHRcdGxldCBzd2F0Y2hlcyA9IGQzLnNlbGVjdEFsbChcIi5zd2F0Y2guY2hlY2tlZFwiKVswXTtcblx0XHRsZXQgZnRzID0gc3dhdGNoZXMubWFwKHM9PnMuZ2V0QXR0cmlidXRlKFwibmFtZVwiKSlcblx0XHRmYWNldC5zZXRWYWx1ZXMoZnRzKTtcblx0XHRzZWxmLnpvb21WaWV3LmhpZ2hsaWdodCgpO1xuXHQgICAgfSlcblx0ICAgIC5hcHBlbmQoXCJpXCIpXG5cdCAgICAgICAgLmF0dHIoXCJjbGFzc1wiLFwibWF0ZXJpYWwtaWNvbnNcIik7XG5cdG5jcy5hcHBlbmQoXCJzcGFuXCIpXG5cdCAgICAudGV4dChjID0+IGMubGJsKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY2xlYXJDYWNoZWREYXRhIChhc2spIHtcblx0aWYgKCFhc2sgfHwgd2luZG93LmNvbmZpcm0oJ0RlbGV0ZSBhbGwgY2FjaGVkIGRhdGEuIEFyZSB5b3Ugc3VyZT8nKSkge1xuXHQgICAgdGhpcy5mZWF0dXJlTWFuYWdlci5jbGVhckNhY2hlZERhdGEoKTtcblx0ICAgIHRoaXMudHJhbnNsYXRvci5jbGVhckNhY2hlZERhdGEoKTtcblx0fVxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGxpbmtUb01naVNucFJlcG9ydCAoKSB7XG5cdGxldCBjID0gdGhpcy5nZXRDb250ZXh0KCk7XG5cdGxldCB1cmxCYXNlID0gJ2h0dHA6Ly93d3cuaW5mb3JtYXRpY3MuamF4Lm9yZy9zbnAvc3VtbWFyeSc7XG5cdGxldCB0YWJBcmcgPSAnc2VsZWN0ZWRUYWI9MSc7XG5cdGxldCBzZWFyY2hCeUFyZyA9ICdzZWFyY2hCeVNhbWVEaWZmPSc7XG5cdGxldCBjaHJBcmcgPSBgc2VsZWN0ZWRDaHJvbW9zb21lPSR7Yy5jaHJ9YDtcblx0bGV0IGNvb3JkQXJnID0gYGNvb3JkaW5hdGU9JHtjLnN0YXJ0fS0ke2MuZW5kfWA7XG5cdGxldCB1bml0QXJnID0gJ2Nvb3JkaW5hdGVVbml0PWJwJztcblx0bGV0IGNzQXJncyA9IGMuZ2Vub21lcy5tYXAoZyA9PiBgc2VsZWN0ZWRTdHJhaW5zPSR7Z31gKVxuXHRsZXQgcnNBcmcgPSBgcmVmZXJlbmNlU3RyYWluPSR7Yy5yZWZ9YDtcblx0bGV0IGxpbmtVcmwgPSBgJHt1cmxCYXNlfT8ke3RhYkFyZ30mJHtzZWFyY2hCeUFyZ30mJHtjaHJBcmd9JiR7Y29vcmRBcmd9JiR7dW5pdEFyZ30mJHtyc0FyZ30mJHtjc0FyZ3Muam9pbignJicpfWBcblx0d2luZG93Lm9wZW4obGlua1VybCwgXCJfYmxhbmtcIik7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGxpbmtUb01naVFUTHMgKCkge1xuXHRsZXQgYyAgICAgICAgPSB0aGlzLmdldENvbnRleHQoKTtcblx0bGV0IHVybEJhc2UgID0gJ2h0dHA6Ly93d3cuaW5mb3JtYXRpY3MuamF4Lm9yZy9hbGxlbGUvc3VtbWFyeSc7XG5cdGxldCBjaHJBcmcgICA9IGBjaHJvbW9zb21lPSR7Yy5jaHJ9YDtcblx0bGV0IGNvb3JkQXJnID0gYGNvb3JkaW5hdGU9JHtjLnN0YXJ0fS0ke2MuZW5kfWA7XG5cdGxldCB1bml0QXJnICA9ICdjb29yZFVuaXQ9YnAnO1xuXHRsZXQgdHlwZUFyZyAgPSAnYWxsZWxlVHlwZT1RVEwnO1xuXHRsZXQgbGlua1VybCAgPSBgJHt1cmxCYXNlfT8ke2NockFyZ30mJHtjb29yZEFyZ30mJHt1bml0QXJnfSYke3R5cGVBcmd9YDtcblx0d2luZG93Lm9wZW4obGlua1VybCwgXCJfYmxhbmtcIik7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGxpbmtUb01naUpCcm93c2UgKCkge1xuXHRsZXQgYyA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuXHRsZXQgdXJsQmFzZSA9ICdodHRwOi8vamJyb3dzZS5pbmZvcm1hdGljcy5qYXgub3JnLyc7XG5cdGxldCBkYXRhQXJnID0gJ2RhdGE9ZGF0YSUyRm1vdXNlJzsgLy8gXCJkYXRhL21vdXNlXCJcblx0bGV0IGxvY0FyZyAgPSBgbG9jPWNociR7Yy5jaHJ9JTNBJHtjLnN0YXJ0fS4uJHtjLmVuZH1gO1xuXHRsZXQgdHJhY2tzICA9IFsnRE5BJywnTUdJX0dlbm9tZV9GZWF0dXJlcycsJ05DQklfQ0NEUycsJ05DQkknLCdFTlNFTUJMJ107XG5cdGxldCB0cmFja3NBcmc9YHRyYWNrcz0ke3RyYWNrcy5qb2luKCcsJyl9YDtcblx0bGV0IGhpZ2hsaWdodEFyZyA9ICdoaWdobGlnaHQ9Jztcblx0bGV0IGxpbmtVcmwgPSBgJHt1cmxCYXNlfT8keyBbZGF0YUFyZyxsb2NBcmcsdHJhY2tzQXJnLGhpZ2hsaWdodEFyZ10uam9pbignJicpIH1gO1xuXHR3aW5kb3cub3BlbihsaW5rVXJsLCBcIl9ibGFua1wiKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRG93bmxvYWRzIEROQSBzZXF1ZW5jZXMgb2YgdGhlIHNwZWNpZmllZCB0eXBlIGluIEZBU1RBIGZvcm1hdCBmb3IgdGhlIHNwZWNpZmllZCBmZWF0dXJlLlxuICAgIC8vIElmIGdlbm9tZXMgaXMgc3BlY2lmaWVkLCBsaXN0cyB0aGUgc3BlY2lmaWMgZ2Vub21lcyB0byByZXRyaWV2ZSBmcm9tOyBvdGhlcndpc2UgcmV0cmlldmVzIGZyb20gYWxsIGdlbm9tZXMuXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICAgZiAob2JqZWN0KSB0aGUgZmVhdHVyZVxuICAgIC8vICAgICB0eXBlIChzdHJpbmcpIHdoaWNoIHNlcXVlbmNlcyB0byBkb3dubG9hZDogJ2dlbm9taWMnLCdleG9uJywnQ0RTJyxcbiAgICAvLyAgICAgZ2Vub21lcyAobGlzdCBvZiBzdHJpbmdzKSBuYW1lcyBvZiBnZW5vbWVzIHRvIHJldHJpZXZlIGZyb20uIElmIG5vdCBzcGVjaWZpZWQsXG4gICAgLy8gICAgICAgICByZXRyaWV2ZXMgc2VxdWVuZWNzIGZyb20gYWxsIGF2YWlsYWJsZSBtb3VzZSBnZW5vbWVzLlxuICAgIC8vXG4gICAgZG93bmxvYWRGYXN0YSAoZiwgdHlwZSwgZ2Vub21lcykge1xuXHRsZXQgcSA9IHRoaXMucXVlcnlNYW5hZ2VyLmF1eERhdGFNYW5hZ2VyLnNlcXVlbmNlc0ZvckZlYXR1cmUoZiwgdHlwZSwgZ2Vub21lcylcblx0aWYgKHEpIHdpbmRvdy5vcGVuKHEsXCJfYmxhbmtcIik7XG4gICAgfVxuICAgIGxpbmtUb1JlcG9ydFBhZ2UgKGYpIHtcbiAgICAgICAgbGV0IHUgPSB0aGlzLnF1ZXJ5TWFuYWdlci5hdXhEYXRhTWFuYWdlci5saW5rVG9SZXBvcnRQYWdlKGYuaWQpO1xuXHR3aW5kb3cub3Blbih1LCAnX2JsYW5rJylcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBNR1ZBcHBcblxuZXhwb3J0IHsgTUdWQXBwIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9NR1ZBcHAuanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY2xhc3MgR2Vub21lIHtcbiAgY29uc3RydWN0b3IgKGNmZykge1xuICAgIHRoaXMubmFtZSA9IGNmZy5uYW1lO1xuICAgIHRoaXMubGFiZWw9IGNmZy5sYWJlbDtcbiAgICB0aGlzLmNocm9tb3NvbWVzID0gW107XG4gICAgdGhpcy5tYXhsZW4gPSAtMTtcbiAgICB0aGlzLnhzY2FsZSA9IG51bGw7XG4gICAgdGhpcy55c2NhbGUgPSBudWxsO1xuICAgIHRoaXMuem9vbVkgID0gLTE7XG4gIH1cbiAgZ2V0Q2hyb21vc29tZSAobikge1xuICAgICAgaWYgKHR5cGVvZihuKSA9PT0gJ3N0cmluZycpXG5cdCAgcmV0dXJuIHRoaXMuY2hyb21vc29tZXMuZmlsdGVyKGMgPT4gYy5uYW1lID09PSBuKVswXTtcbiAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gdGhpcy5jaHJvbW9zb21lc1tuXTtcbiAgfVxuICBoYXNDaHJvbW9zb21lIChuKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRDaHJvbW9zb21lKG4pID8gdHJ1ZSA6IGZhbHNlO1xuICB9XG59XG5cbmV4cG9ydCB7IEdlbm9tZSB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvR2Vub21lLmpzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7ZDNqc29uLCBkM3Rzdiwgb3ZlcmxhcHMsIHN1YnRyYWN0fSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7RmVhdHVyZX0gZnJvbSAnLi9GZWF0dXJlJztcbmltcG9ydCB7RmVhdHVyZVBhY2tlcn0gZnJvbSAnLi9GZWF0dXJlUGFja2VyJztcbmltcG9ydCB7S2V5U3RvcmV9IGZyb20gJy4vS2V5U3RvcmUnO1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEhvdyB0aGUgYXBwIGxvYWRzIGZlYXR1cmUgZGF0YS4gUHJvdmlkZXMgdHdvIGNhbGxzOlxuLy8gUmVxdWVzdHMgZmVhdHVyZXMgZnJvbSB0aGUgc2VydmVyIGFuZCByZWdpc3RlcnMgdGhlbSBpbiBhIGNhY2hlLlxuLy8gSW50ZXJhY3RzIHdpdGggdGhlIGJhY2sgZW5kIHRvIGxvYWQgZmVhdHVyZXMuXG4vL1xuY2xhc3MgRmVhdHVyZU1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yIChhcHApIHtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG5cdHRoaXMuYXV4RGF0YU1hbmFnZXIgPSB0aGlzLmFwcC5xdWVyeU1hbmFnZXIuYXV4RGF0YU1hbmFnZXI7XG4gICAgICAgIHRoaXMuaWQyZmVhdCA9IHt9O1x0XHQvLyBpbmRleCBmcm9tICBmZWF0dXJlIElEIHRvIGZlYXR1cmVcblx0dGhpcy5jYW5vbmljYWwyZmVhdHMgPSB7fTtcdC8vIGluZGV4IGZyb20gY2Fub25pY2FsIElEIC0+IFsgZmVhdHVyZXMgdGFnZ2VkIHdpdGggdGhhdCBpZCBdXG5cdHRoaXMuc3ltYm9sMmZlYXRzID0ge31cdFx0Ly8gaW5kZXggZnJvbSBzeW1ib2wgLT4gWyBmZWF0dXJlcyBoYXZpbmcgdGhhdCBzeW1ib2wgXVxuXHRcdFx0XHRcdC8vIHdhbnQgY2FzZSBpbnNlbnNpdGl2ZSBzZWFyY2hlcywgc28ga2V5cyBhcmUgbG93ZXIgY2FzZWRcblx0dGhpcy5jYWNoZSA9IHt9O1x0XHQvLyB7Z2Vub21lLm5hbWUgLT4ge2Noci5uYW1lIC0+IGxpc3Qgb2YgYmxvY2tzfX1cblx0dGhpcy5taW5lRmVhdHVyZUNhY2hlID0ge307XHQvLyBhdXhpbGlhcnkgaW5mbyBwdWxsZWQgZnJvbSBNb3VzZU1pbmUgXG5cdHRoaXMubG9hZGVkR2Vub21lcyA9IG5ldyBTZXQoKTsgLy8gdGhlIHNldCBvZiBHZW5vbWVzIHRoYXQgaGF2ZSBiZWVuIGZ1bGx5IGxvYWRlZFxuXHQvL1xuXHR0aGlzLmZTdG9yZSA9IG5ldyBLZXlTdG9yZSgnZmVhdHVyZXMnKTsgLy8gbWFwcyBnZW5vbWUgbmFtZSAtPiBsaXN0IG9mIGZlYXR1cmVzXG4gICAgfVxuIFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHByb2Nlc3NGZWF0dXJlIChnZW5vbWUsIGQpIHtcblx0Ly8gSWYgd2UndmUgYWxyZWFkeSBnb3QgdGhpcyBvbmUgaW4gdGhlIGNhY2hlLCByZXR1cm4gaXQuXG5cdGxldCBmID0gdGhpcy5pZDJmZWF0W2QuSURdO1xuXHRpZiAoZikgcmV0dXJuIGY7XG5cdC8vIENyZWF0ZSBhIG5ldyBGZWF0dXJlXG5cdGYgPSBuZXcgRmVhdHVyZShkKTtcblx0Zi5nZW5vbWUgPSBnZW5vbWVcblx0Ly8gaW5kZXggZnJvbSB0cmFuc2NyaXB0IElEIC0+IHRyYW5zY3JpcHRcblx0Zi50aW5kZXggPSB7fTtcblx0Ly8gUmVnaXN0ZXIgaXQuXG5cdHRoaXMuaWQyZmVhdFtmLklEXSA9IGY7XG5cdC8vIGdlbm9tZSBjYWNoZVxuXHRsZXQgZ2MgPSB0aGlzLmNhY2hlW2dlbm9tZS5uYW1lXSA9ICh0aGlzLmNhY2hlW2dlbm9tZS5uYW1lXSB8fCB7fSk7XG5cdC8vIGNocm9tb3NvbWUgY2FjaGUgKHcvaW4gZ2Vub21lKVxuXHRsZXQgY2MgPSBnY1tmLmNocl0gPSAoZ2NbZi5jaHJdIHx8IFtdKTtcblx0Y2MucHVzaChmKTtcblx0Ly9cblx0aWYgKGYuY2Fub25pY2FsICYmIGYuY2Fub25pY2FsICE9PSAnLicpIHtcblx0ICAgIGxldCBsc3QgPSB0aGlzLmNhbm9uaWNhbDJmZWF0c1tmLmNhbm9uaWNhbF0gPSAodGhpcy5jYW5vbmljYWwyZmVhdHNbZi5jYW5vbmljYWxdIHx8IFtdKTtcblx0ICAgIGxzdC5wdXNoKGYpO1xuXHR9XG5cdGlmIChmLnN5bWJvbCAmJiBmLnN5bWJvbCAhPT0gJy4nKSB7XG5cdCAgICBsZXQgcyA9IGYuc3ltYm9sLnRvTG93ZXJDYXNlKCk7XG5cdCAgICBsZXQgbHN0ID0gdGhpcy5zeW1ib2wyZmVhdHNbc10gPSAodGhpcy5zeW1ib2wyZmVhdHNbc10gfHwgW10pO1xuXHQgICAgbHN0LnB1c2goZik7XG5cdH1cblx0Ly8gaGVyZSB5J2dvLlxuXHRyZXR1cm4gZjtcbiAgICB9XG4gICAgLy9cbiAgICBwcm9jZXNzRXhvbiAoZSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInByb2Nlc3MgZXhvbjogXCIsIGUpO1xuXHRsZXQgZmVhdCA9IHRoaXMuaWQyZmVhdFtlLmdlbmUucHJpbWFyeUlkZW50aWZpZXJdO1xuXHRsZXQgZXhvbiA9IHtcblx0ICAgIElEOiBlLnByaW1hcnlJZGVudGlmaWVyLFxuXHQgICAgdHJhbnNjcmlwdElEczogZS50cmFuc2NyaXB0cy5tYXAodCA9PiB0LnByaW1hcnlJZGVudGlmaWVyKSxcblx0ICAgIGNocjogZS5jaHJvbW9zb21lLnByaW1hcnlJZGVudGlmaWVyLFxuXHQgICAgc3RhcnQ6IGUuY2hyb21vc29tZUxvY2F0aW9uLnN0YXJ0LFxuXHQgICAgZW5kOiAgIGUuY2hyb21vc29tZUxvY2F0aW9uLmVuZCxcblx0ICAgIGZlYXR1cmU6IGZlYXRcblx0fTtcblx0ZXhvbi50cmFuc2NyaXB0SURzLmZvckVhY2goIHRpZCA9PiB7XG5cdCAgICBsZXQgdCA9IGZlYXQudGluZGV4W3RpZF07XG5cdCAgICBpZiAoIXQpIHtcblx0ICAgICAgICB0ID0geyBJRDogdGlkLCBmZWF0dXJlOiBmZWF0LCBleG9uczogW10sIHN0YXJ0OiBJbmZpbml0eSwgZW5kOiAwIH07XG5cdFx0ZmVhdC50cmFuc2NyaXB0cy5wdXNoKHQpO1xuXHRcdGZlYXQudGluZGV4W3RpZF0gPSB0O1xuXHQgICAgfVxuXHQgICAgdC5leG9ucy5wdXNoKGV4b24pO1xuXHQgICAgdC5zdGFydCA9IE1hdGgubWluKHQuc3RhcnQsIGV4b24uc3RhcnQpO1xuXHQgICAgdC5lbmQgPSBNYXRoLm1heCh0LmVuZCwgZXhvbi5lbmQpO1xuXHR9KTtcblx0ZmVhdC5leG9ucy5wdXNoKGV4b24pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFByb2Nlc3NlcyB0aGUgXCJyYXdcIiBmZWF0dXJlcyByZXR1cm5lZCBieSB0aGUgc2VydmVyLlxuICAgIC8vIFR1cm5zIHRoZW0gaW50byBGZWF0dXJlIG9iamVjdHMgYW5kIHJlZ2lzdGVycyB0aGVtLlxuICAgIC8vIElmIHRoZSBzYW1lIHJhdyBmZWF0dXJlIGlzIHJlZ2lzdGVyZWQgYWdhaW4sXG4gICAgLy8gdGhlIEZlYXR1cmUgb2JqZWN0IGNyZWF0ZWQgdGhlIGZpcnN0IHRpbWUgaXMgcmV0dXJuZWQuXG4gICAgLy8gKEkuZS4sIHJlZ2lzdGVyaW5nIHRoZSBzYW1lIGZlYXR1cmUgbXVsdGlwbGUgdGltZXMgaXMgb2spXG4gICAgLy9cbiAgICBwcm9jZXNzRmVhdHVyZXMgKGdlbm9tZSwgZmVhdHMpIHtcblx0cmV0dXJuIGZlYXRzLm1hcChkID0+IHRoaXMucHJvY2Vzc0ZlYXR1cmUoZ2Vub21lLCBkKSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZW5zdXJlRmVhdHVyZXNCeUdlbm9tZSAoZ2Vub21lKSB7XG5cdGlmICh0aGlzLmxvYWRlZEdlbm9tZXMuaGFzKGdlbm9tZSkpXG5cdCAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuXHRyZXR1cm4gdGhpcy5mU3RvcmUuZ2V0KGdlbm9tZS5uYW1lKS50aGVuKGRhdGEgPT4ge1xuXHQgICAgaWYgKGRhdGEgPT09IHVuZGVmaW5lZCkge1xuXHRcdGNvbnNvbGUubG9nKFwiUmVxdWVzdGluZzpcIiwgZ2Vub21lLm5hbWUsICk7XG5cdFx0bGV0IHVybCA9IGAuL2RhdGEvZ2Vub21lZGF0YS8ke2dlbm9tZS5uYW1lfS1mZWF0dXJlcy50c3ZgO1xuXHRcdHJldHVybiBkM3Rzdih1cmwpLnRoZW4oIHJhd2ZlYXRzID0+IHtcblx0XHQgICAgcmF3ZmVhdHMuc29ydCggKGEsYikgPT4ge1xuXHRcdFx0aWYgKGEuY2hyIDwgYi5jaHIpXG5cdFx0XHQgICAgcmV0dXJuIC0xO1xuXHRcdFx0ZWxzZSBpZiAoYS5jaHIgPiBiLmNocilcblx0XHRcdCAgICByZXR1cm4gMTtcblx0XHRcdGVsc2Vcblx0XHRcdCAgICByZXR1cm4gYS5zdGFydCAtIGIuc3RhcnQ7XG5cdFx0ICAgIH0pO1xuXHRcdCAgICB0aGlzLmZTdG9yZS5zZXQoZ2Vub21lLm5hbWUsIHJhd2ZlYXRzKTtcblx0XHQgICAgbGV0IGZlYXRzID0gdGhpcy5wcm9jZXNzRmVhdHVyZXMoZ2Vub21lLCByYXdmZWF0cyk7XG5cdFx0fSk7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0XHRjb25zb2xlLmxvZyhcIkZvdW5kIGluIGNhY2hlOlwiLCBnZW5vbWUubmFtZSwgKTtcblx0XHRsZXQgZmVhdHMgPSB0aGlzLnByb2Nlc3NGZWF0dXJlcyhnZW5vbWUsIGRhdGEpO1xuXHRcdHJldHVybiB0cnVlO1xuXHQgICAgfVxuXHR9KS50aGVuKCAoKT0+IHtcblx0ICAgIHRoaXMubG9hZGVkR2Vub21lcy5hZGQoZ2Vub21lKTsgIFxuXHQgICAgdGhpcy5hcHAuc2hvd1N0YXR1cyhgTG9hZGVkOiAke2dlbm9tZS5uYW1lfWApO1xuXHQgICAgcmV0dXJuIHRydWU7IFxuXHR9KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gYWxsIGV4b25zIGZvciB0aGUgZ2l2ZW4gc2V0IG9mIGdlbmUgaWRzLlxuICAgIC8vIEdlbmUgSURzIGFyZSBnZW5vbWUtc3BlY2lmaWMsIE5PVCBjYW5vbmljYWwuXG4gICAgLy9cbiAgICBlbnN1cmVFeG9uc0J5R2VuZUlkcyAoaWRzKSB7XG5cdC8vIE1hcCBpZHMgdG8gRmVhdHVyZSBvYmplY3RzLCBmaWx0ZXIgZm9yIHRob3NlIHdoZXJlIGV4b25zIGhhdmUgbm90IGJlZW4gcmV0cmlldmVkIHlldFxuXHQvLyBFeG9ucyBhY2N1bXVsYXRlIGluIHRoZWlyIGZlYXR1cmVzIC0gbm8gY2FjaGUgZXZpY3Rpb24gaW1wbGVtZW50ZWQgeWV0LiBGSVhNRS5cblx0Ly8gXG5cdGxldCBmZWF0cyA9IChpZHN8fFtdKS5tYXAoaSA9PiB0aGlzLmlkMmZlYXRbaV0pLmZpbHRlcihmID0+IHtcblx0ICAgIGlmICghIGYgfHwgZi5leG9uc0xvYWRlZClcblx0ICAgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICBmLmV4b25zTG9hZGVkID0gdHJ1ZTtcblx0ICAgIHJldHVybiB0cnVlO1xuXHR9KTtcblx0aWYgKGZlYXRzLmxlbmd0aCA9PT0gMClcblx0ICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0cmV0dXJuIHRoaXMuYXV4RGF0YU1hbmFnZXIuZXhvbnNCeUdlbmVJZHMoZmVhdHMubWFwKGY9PmYuSUQpKS50aGVuKGV4b25zID0+IHtcblx0ICAgIGV4b25zLmZvckVhY2goIGUgPT4geyB0aGlzLnByb2Nlc3NFeG9uKGUpOyB9KTtcblx0fSk7XG4gICAgfVxuXG4gICAgLypcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFsbCBleG9ucyBmb3IgZ2VuZXMgaW4gdGhlIHNwZWNpZmllZCBnZW5vbWVcbiAgICAvLyB0aGF0IG92ZXJsYXAgdGhlIHNwZWNpZmllZCByYW5nZS5cbiAgICAvL1xuICAgIGVuc3VyZUV4b25zQnlSYW5nZSAoZ2Vub21lLCBjaHIsIHN0YXJ0LCBlbmQpIHtcblx0cmV0dXJuIHRoaXMuYXV4RGF0YU1hbmFnZXIuZXhvbnNCeVJhbmdlKGdlbm9tZSxjaHIsc3RhcnQsZW5kKS50aGVuKGV4b25zID0+IHtcblx0ICAgIGV4b25zLmZvckVhY2goIGUgPT4ge1xuXHQgICAgICAgIHRoaXMucHJvY2Vzc0V4b24oZSk7XG5cdCAgICB9KTtcblx0fSk7XG4gICAgfVxuICAgICovXG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBsb2FkR2Vub21lcyAoZ2Vub21lcykge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoZ2Vub21lcy5tYXAoZyA9PiB0aGlzLmVuc3VyZUZlYXR1cmVzQnlHZW5vbWUgKGcpKSkudGhlbigoKT0+dHJ1ZSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0Q2FjaGVkRmVhdHVyZXNCeVJhbmdlIChnZW5vbWUsIHJhbmdlKSB7XG4gICAgICAgIGxldCBnYyA9IHRoaXMuY2FjaGVbZ2Vub21lLm5hbWVdIDtcblx0aWYgKCFnYykgcmV0dXJuIFtdO1xuXHRsZXQgY0ZlYXRzID0gZ2NbcmFuZ2UuY2hyXTtcblx0aWYgKCFjRmVhdHMpIHJldHVybiBbXTtcblx0Ly8gRklYTUU6IHNob3VsZCBiZSBzbWFydGVyIHRoYW4gdGVzdGluZyBldmVyeSBmZWF0dXJlIVxuXHRsZXQgZmVhdHMgPSBjRmVhdHMuZmlsdGVyKGNmID0+IG92ZXJsYXBzKGNmLCByYW5nZSkpO1xuICAgICAgICByZXR1cm4gZmVhdHM7XHRcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGFsbCBjYWNoZWQgZmVhdHVyZXMgaGF2aW5nIHRoZSBnaXZlbiBjYW5vbmljYWwgaWQuXG4gICAgZ2V0Q2FjaGVkRmVhdHVyZUJ5SWQgKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlkMmZlYXRzW2lkXTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGFsbCBjYWNoZWQgZmVhdHVyZXMgaGF2aW5nIHRoZSBnaXZlbiBjYW5vbmljYWwgaWQuXG4gICAgZ2V0Q2FjaGVkRmVhdHVyZXNCeUNhbm9uaWNhbElkIChjaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2Fub25pY2FsMmZlYXRzW2NpZF0gfHwgW107XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyBhIGxpc3Qgb2YgZmVhdHVyZXMgdGhhdCBtYXRjaCB0aGUgZ2l2ZW4gbGFiZWwsIHdoaWNoIGNhbiBiZSBhbiBpZCwgY2Fub25pY2FsIGlkLCBvciBzeW1ib2wuXG4gICAgLy8gSWYgZ2Vub21lIGlzIHNwZWNpZmllZCwgbGltaXQgcmVzdWx0cyB0byBmZWF0dXJlcyBmcm9tIHRoYXQgZ2Vub21lLlxuICAgIC8vIFxuICAgIGdldENhY2hlZEZlYXR1cmVzQnlMYWJlbCAobGFiZWwsIGdlbm9tZSkge1xuXHRsZXQgZiA9IHRoaXMuaWQyZmVhdFtsYWJlbF1cblx0bGV0IGZlYXRzID0gZiA/IFtmXSA6IHRoaXMuY2Fub25pY2FsMmZlYXRzW2xhYmVsXSB8fCB0aGlzLnN5bWJvbDJmZWF0c1tsYWJlbC50b0xvd2VyQ2FzZSgpXSB8fCBbXTtcblx0cmV0dXJuIGdlbm9tZSA/IGZlYXRzLmZpbHRlcihmPT4gZi5nZW5vbWUgPT09IGdlbm9tZSkgOiBmZWF0cztcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIGZlYXR1cmVzIGluIFxuICAgIC8vIHRoZSBzcGVjaWZpZWQgcmFuZ2VzIG9mIHRoZSBzcGVjaWZpZWQgZ2Vub21lLlxuICAgIGdldEZlYXR1cmVzQnlSYW5nZSAoZ2Vub21lLCByYW5nZXMsIGdldEV4b25zKSB7XG5cdGxldCBmaWRzID0gW11cblx0bGV0IHAgPSB0aGlzLmVuc3VyZUZlYXR1cmVzQnlHZW5vbWUoZ2Vub21lKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJhbmdlcy5mb3JFYWNoKCByID0+IHtcblx0ICAgICAgICByLmZlYXR1cmVzID0gdGhpcy5nZXRDYWNoZWRGZWF0dXJlc0J5UmFuZ2UoZ2Vub21lLCByKSBcblx0XHRyLmdlbm9tZSA9IGdlbm9tZTtcblx0XHRmaWRzID0gZmlkcy5jb25jYXQoci5mZWF0dXJlcy5tYXAoZiA9PiBmLklEKSlcblx0ICAgIH0pO1xuXHQgICAgbGV0IHJlc3VsdHMgPSB7IGdlbm9tZSwgYmxvY2tzOnJhbmdlcyB9O1xuXHQgICAgcmV0dXJuIHJlc3VsdHM7XG5cdH0pO1xuXHRpZiAoZ2V0RXhvbnMpXG5cdCAgICBwID0gcC50aGVuKHJlc3VsdHMgPT4ge1xuXHQgICAgICAgIHJldHVybiB0aGlzLmVuc3VyZUV4b25zQnlHZW5lSWRzKGZpZHMpLnRoZW4oKCk9PnJlc3VsdHMpO1xuXHRcdH0pO1xuXHRyZXR1cm4gcDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSBmZWF0dXJlcyBoYXZpbmcgdGhlIHNwZWNpZmllZCBpZHMgZnJvbSB0aGUgc3BlY2lmaWVkIGdlbm9tZS5cbiAgICBnZXRGZWF0dXJlc0J5SWQgKGdlbm9tZSwgaWRzLCBnZXRFeG9ucykge1xuICAgICAgICByZXR1cm4gdGhpcy5lbnN1cmVGZWF0dXJlc0J5R2Vub21lKGdlbm9tZSkudGhlbiggKCkgPT4ge1xuXHQgICAgbGV0IGZlYXRzID0gW107XG5cdCAgICBsZXQgc2VlbiA9IG5ldyBTZXQoKTtcblx0ICAgIGxldCBhZGRmID0gKGYpID0+IHtcblx0XHRpZiAoZi5nZW5vbWUgIT09IGdlbm9tZSkgcmV0dXJuO1xuXHRcdGlmIChzZWVuLmhhcyhmLmlkKSkgcmV0dXJuO1xuXHRcdHNlZW4uYWRkKGYuaWQpO1xuXHRcdGZlYXRzLnB1c2goZik7XG5cdCAgICB9O1xuXHQgICAgbGV0IGFkZCA9IChmKSA9PiB7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoZikpIFxuXHRcdCAgICBmLmZvckVhY2goZmYgPT4gYWRkZihmZikpO1xuXHRcdGVsc2Vcblx0XHQgICAgYWRkZihmKTtcblx0ICAgIH07XG5cdCAgICBmb3IgKGxldCBpIG9mIGlkcyl7XG5cdFx0bGV0IGYgPSB0aGlzLmNhbm9uaWNhbDJmZWF0c1tpXSB8fCB0aGlzLmlkMmZlYXRbaV07XG5cdFx0ZiAmJiBhZGQoZik7XG5cdCAgICB9XG5cdCAgICBpZiAoZ2V0RXhvbnMpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcy5lbnN1cmVFeG9uc0J5R2VuZUlkcyhmZWF0cy5tYXAoZj0+Zi5JRCkpLnRoZW4oKCk9PmZlYXRzKTtcblx0ICAgIH1cblx0ICAgIGVsc2Vcblx0XHRyZXR1cm4gZmVhdHM7XG5cdH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjbGVhckNhY2hlZERhdGEgKCkge1xuXHRjb25zb2xlLmxvZyhcIkZlYXR1cmVNYW5hZ2VyOiBDYWNoZSBjbGVhcmVkLlwiKVxuICAgICAgICByZXR1cm4gdGhpcy5mU3RvcmUuY2xlYXIoKTtcbiAgICB9XG5cbn0gLy8gZW5kIGNsYXNzIEZlYXR1cmUgTWFuYWdlclxuXG5leHBvcnQgeyBGZWF0dXJlTWFuYWdlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvRmVhdHVyZU1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IG92ZXJsYXBzIH0gZnJvbSAnLi91dGlscyc7XG5cbi8vIEdpdmVuIGEgc2V0IG9mIHJlY3RhbmdsZXMgd2hlcmUgZWFjaCByZWN0YW5nbGUncyB4IGNvb3JkaW5hdGVzIGFuZCBoZWlnaHQgYXJlXG4vLyBmaXhlZCwgYXNzaWducyB5IGNvb3JkaW5hdGVzIHNvIHRoYXQgdGhlIHJlY3RhbmdsZXMgZG8gbm90IG92ZXJsYXAuXG4vLyBVc2VzIHNjcmVlbiBjb29yZGluYXRlcywgaWUsIHVwIGlzIC15LiBcbi8vIFBhY2tzIHJlY3RhbmdsZXMgb24gYSBob3Jpem9udGFsIGJhc2VsaW5lIGF0IHk9MC5cbi8vIEFueSByZWN0YW5nbGUgd2l0aG91dCBhIGhlaWdodCBpcyBhcmJpdHJhcmlseSBhc3NpZ25lZCBhIGhlaWdodCBvZiAxLlxuLy9cbi8vIFVzYWdlOlxuLy8gICAgIG5ldyBGZWF0dXJlUGFja2VyKCkucGFjayhteVJlY3RhbmdsZXMsIDEwLCB0cnVlKTtcbi8vXG5jbGFzcyBGZWF0dXJlUGFja2VyIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHRoaXMuYnVmZmVyID0gbnVsbDtcblx0dGhpcy55Z2FwID0gMDsgLy8gbWluIGRpc3RhbmNlIGJldHdlZW4gcmVjdGFuZ2xlcyBpbiB0aGUgeSBkaW1lbnNpb25cbiAgICB9XG4gICAgYXNzaWduTmV4dCAoZikge1xuXHRmLmhlaWdodCA9IGYuaGVpZ2h0IHx8IDE7XG5cdGxldCBtaW5HYXAgPSBmLmhlaWdodCArIDIqdGhpcy55Z2FwO1xuXHRsZXQgeSA9IDA7XG5cdGxldCBpID0gMDtcblx0Ly8gcmVtb3ZlIGFueXRoaW5nIHRoYXQgZG9lcyBub3Qgb3ZlcmxhcCB0aGUgbmV3IGZlYXR1cmVcbiAgICAgICAgdGhpcy5idWZmZXIgPSB0aGlzLmJ1ZmZlci5maWx0ZXIoZmYgPT4gb3ZlcmxhcHMoZmYsIGYpKTtcblx0Ly8gTG9vayBmb3IgYSBiaWcgZW5vdWdoIGdhcCBpbiB0aGUgeSBkaW1lbnNpb24gYmV0d2VlbiBleGlzdGluZyBibG9ja3Ncblx0Ly8gdG8gZml0IHRoaXMgbmV3IG9uZS4gSWYgbm9uZSBmb3VuZCwgc3RhY2sgb24gdG9wLlxuXHQvLyBCdWZmZXIgaXMgbWFpbnRhaW5lZCBpbiByZXZlcnNlIHkgc29ydCBvcmRlci5cblx0Zm9yIChsZXQgZmYgaW4gdGhpcy5idWZmZXIpIHtcblx0ICAgIGxldCBnYXBTaXplID0geSAtIChmZi55ICsgZmYuaGVpZ2h0KTtcblx0ICAgIGlmIChnYXBTaXplID49IG1pbkdhcCkge1xuXHRcdGJyZWFrO1xuXHQgICAgfVxuXHQgICAgeSA9IGZmLnk7XG5cdCAgICBpICs9IDE7XG5cdH07XG5cdGYueSA9IHkgLSBmLmhlaWdodCAtIHRoaXMueWdhcDtcblx0dGhpcy5idWZmZXIuc3BsaWNlKGksMCxmKTtcbiAgICB9XG4gICAgLy8gUGFja3MgZmVhdHVyZXMgYnkgYXNzaWduaW5nIHkgY29vcmRpbmF0ZXMuXG4gICAgcGFjayAoZmVhdHMsIHlnYXAsIHNvcnQpIHtcbiAgICAgICAgdGhpcy5idWZmZXIgPSBbXTtcblx0dGhpcy55Z2FwID0geWdhcCB8fCAwO1xuICAgICAgICBpZiAoc29ydCkgZmVhdHMuc29ydCgoYSxiKSA9PiBhLnN0YXJ0IC0gYi5zdGFydCk7XG5cdGZlYXRzLmZvckVhY2goZiA9PiB0aGlzLmFzc2lnbk5leHQoZikpO1xuXHR0aGlzLmJ1ZmZlciA9IG51bGw7XG4gICAgfVxufVxuXG5leHBvcnQgeyBGZWF0dXJlUGFja2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9GZWF0dXJlUGFja2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjbGFzcyBTdG9yZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihkYk5hbWUgPSAna2V5dmFsLXN0b3JlJywgc3RvcmVOYW1lID0gJ2tleXZhbCcpIHtcclxuICAgICAgICB0aGlzLnN0b3JlTmFtZSA9IHN0b3JlTmFtZTtcclxuICAgICAgICB0aGlzLl9kYnAgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wZW5yZXEgPSBpbmRleGVkREIub3BlbihkYk5hbWUsIDEpO1xyXG4gICAgICAgICAgICBvcGVucmVxLm9uZXJyb3IgPSAoKSA9PiByZWplY3Qob3BlbnJlcS5lcnJvcik7XHJcbiAgICAgICAgICAgIG9wZW5yZXEub25zdWNjZXNzID0gKCkgPT4gcmVzb2x2ZShvcGVucmVxLnJlc3VsdCk7XHJcbiAgICAgICAgICAgIC8vIEZpcnN0IHRpbWUgc2V0dXA6IGNyZWF0ZSBhbiBlbXB0eSBvYmplY3Qgc3RvcmVcclxuICAgICAgICAgICAgb3BlbnJlcS5vbnVwZ3JhZGVuZWVkZWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvcGVucmVxLnJlc3VsdC5jcmVhdGVPYmplY3RTdG9yZShzdG9yZU5hbWUpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgX3dpdGhJREJTdG9yZSh0eXBlLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kYnAudGhlbihkYiA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gZGIudHJhbnNhY3Rpb24odGhpcy5zdG9yZU5hbWUsIHR5cGUpO1xyXG4gICAgICAgICAgICB0cmFuc2FjdGlvbi5vbmNvbXBsZXRlID0gKCkgPT4gcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB0cmFuc2FjdGlvbi5vbmFib3J0ID0gdHJhbnNhY3Rpb24ub25lcnJvciA9ICgpID0+IHJlamVjdCh0cmFuc2FjdGlvbi5lcnJvcik7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHRoaXMuc3RvcmVOYW1lKSk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG59XHJcbmxldCBzdG9yZTtcclxuZnVuY3Rpb24gZ2V0RGVmYXVsdFN0b3JlKCkge1xyXG4gICAgaWYgKCFzdG9yZSlcclxuICAgICAgICBzdG9yZSA9IG5ldyBTdG9yZSgpO1xyXG4gICAgcmV0dXJuIHN0b3JlO1xyXG59XHJcbmZ1bmN0aW9uIGdldChrZXksIHN0b3JlID0gZ2V0RGVmYXVsdFN0b3JlKCkpIHtcclxuICAgIGxldCByZXE7XHJcbiAgICByZXR1cm4gc3RvcmUuX3dpdGhJREJTdG9yZSgncmVhZG9ubHknLCBzdG9yZSA9PiB7XHJcbiAgICAgICAgcmVxID0gc3RvcmUuZ2V0KGtleSk7XHJcbiAgICB9KS50aGVuKCgpID0+IHJlcS5yZXN1bHQpO1xyXG59XHJcbmZ1bmN0aW9uIHNldChrZXksIHZhbHVlLCBzdG9yZSA9IGdldERlZmF1bHRTdG9yZSgpKSB7XHJcbiAgICByZXR1cm4gc3RvcmUuX3dpdGhJREJTdG9yZSgncmVhZHdyaXRlJywgc3RvcmUgPT4ge1xyXG4gICAgICAgIHN0b3JlLnB1dCh2YWx1ZSwga2V5KTtcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGRlbChrZXksIHN0b3JlID0gZ2V0RGVmYXVsdFN0b3JlKCkpIHtcclxuICAgIHJldHVybiBzdG9yZS5fd2l0aElEQlN0b3JlKCdyZWFkd3JpdGUnLCBzdG9yZSA9PiB7XHJcbiAgICAgICAgc3RvcmUuZGVsZXRlKGtleSk7XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBjbGVhcihzdG9yZSA9IGdldERlZmF1bHRTdG9yZSgpKSB7XHJcbiAgICByZXR1cm4gc3RvcmUuX3dpdGhJREJTdG9yZSgncmVhZHdyaXRlJywgc3RvcmUgPT4ge1xyXG4gICAgICAgIHN0b3JlLmNsZWFyKCk7XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBrZXlzKHN0b3JlID0gZ2V0RGVmYXVsdFN0b3JlKCkpIHtcclxuICAgIGNvbnN0IGtleXMgPSBbXTtcclxuICAgIHJldHVybiBzdG9yZS5fd2l0aElEQlN0b3JlKCdyZWFkb25seScsIHN0b3JlID0+IHtcclxuICAgICAgICAvLyBUaGlzIHdvdWxkIGJlIHN0b3JlLmdldEFsbEtleXMoKSwgYnV0IGl0IGlzbid0IHN1cHBvcnRlZCBieSBFZGdlIG9yIFNhZmFyaS5cclxuICAgICAgICAvLyBBbmQgb3BlbktleUN1cnNvciBpc24ndCBzdXBwb3J0ZWQgYnkgU2FmYXJpLlxyXG4gICAgICAgIChzdG9yZS5vcGVuS2V5Q3Vyc29yIHx8IHN0b3JlLm9wZW5DdXJzb3IpLmNhbGwoc3RvcmUpLm9uc3VjY2VzcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnJlc3VsdClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAga2V5cy5wdXNoKHRoaXMucmVzdWx0LmtleSk7XHJcbiAgICAgICAgICAgIHRoaXMucmVzdWx0LmNvbnRpbnVlKCk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pLnRoZW4oKCkgPT4ga2V5cyk7XHJcbn1cblxuZXhwb3J0IHsgU3RvcmUsIGdldCwgc2V0LCBkZWwsIGNsZWFyLCBrZXlzIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9pZGIta2V5dmFsL2Rpc3QvaWRiLWtleXZhbC5tanNcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgaW5pdE9wdExpc3QgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4vQ29tcG9uZW50JztcbmltcG9ydCB7IEF1eERhdGFNYW5hZ2VyIH0gZnJvbSAnLi9BdXhEYXRhTWFuYWdlcic7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgUXVlcnlNYW5hZ2VyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvciAoYXBwLCBlbHQpIHtcbiAgICAgICAgc3VwZXIoYXBwLCBlbHQpO1xuXHR0aGlzLmNmZyA9IGNvbmZpZy5RdWVyeU1hbmFnZXIuc2VhcmNoVHlwZXM7XG5cdHRoaXMuYXV4RGF0YU1hbmFnZXIgPSBuZXcgQXV4RGF0YU1hbmFnZXIoKTtcblx0dGhpcy5zZWxlY3QgPSBudWxsO1x0Ly8gbXkgPHNlbGVjdD4gZWxlbWVudFxuXHR0aGlzLnRlcm0gPSBudWxsO1x0Ly8gbXkgPGlucHV0PiBlbGVtZW50XG5cdHRoaXMuaW5pdERvbSgpO1xuICAgIH1cbiAgICBpbml0RG9tICgpIHtcblx0dGhpcy5zZWxlY3QgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cInNlYXJjaHR5cGVcIl0nKTtcblx0dGhpcy50ZXJtICAgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cInNlYXJjaHRlcm1cIl0nKTtcblx0Ly9cblx0dGhpcy50ZXJtLmF0dHIoXCJwbGFjZWhvbGRlclwiLCB0aGlzLmNmZ1swXS5wbGFjZWhvbGRlcilcblx0aW5pdE9wdExpc3QodGhpcy5zZWxlY3RbMF1bMF0sIHRoaXMuY2ZnLCBjPT5jLm1ldGhvZCwgYz0+Yy5sYWJlbCk7XG5cdC8vIFdoZW4gdXNlciBjaGFuZ2VzIHRoZSBxdWVyeSB0eXBlIChzZWxlY3RvciksIGNoYW5nZSB0aGUgcGxhY2Vob2xkZXIgdGV4dC5cblx0dGhpcy5zZWxlY3Qub24oXCJjaGFuZ2VcIiwgKCkgPT4ge1xuXHQgICAgbGV0IG9wdCA9IHRoaXMuc2VsZWN0LnByb3BlcnR5KFwic2VsZWN0ZWRPcHRpb25zXCIpWzBdO1xuXHQgICAgdGhpcy50ZXJtLmF0dHIoXCJwbGFjZWhvbGRlclwiLCBvcHQuX19kYXRhX18ucGxhY2Vob2xkZXIpXG5cdCAgICBcblx0fSk7XG5cdC8vIFdoZW4gdXNlciBlbnRlcnMgYSBzZWFyY2ggdGVybSwgcnVuIGEgcXVlcnlcblx0dGhpcy50ZXJtLm9uKFwiY2hhbmdlXCIsICgpID0+IHtcblx0ICAgIGxldCB0ZXJtID0gdGhpcy50ZXJtLnByb3BlcnR5KFwidmFsdWVcIik7XG5cdCAgICB0aGlzLnRlcm0ucHJvcGVydHkoXCJ2YWx1ZVwiLFwiXCIpO1xuXHQgICAgbGV0IHNlYXJjaFR5cGUgID0gdGhpcy5zZWxlY3QucHJvcGVydHkoXCJ2YWx1ZVwiKTtcblx0ICAgIGxldCBsc3ROYW1lID0gdGVybTtcblx0ICAgIGQzLnNlbGVjdChcIiNteWxpc3RzXCIpLmNsYXNzZWQoXCJidXN5XCIsdHJ1ZSk7IC8vIEZJWE1FIC0gcmVhY2hvdmVyXG5cdCAgICB0aGlzLmF1eERhdGFNYW5hZ2VyW3NlYXJjaFR5cGVdKHRlcm0pXHQvLyA8LSBydW4gdGhlIHF1ZXJ5XG5cdCAgICAgIC50aGVuKGZlYXRzID0+IHtcblx0XHQgIC8vIEZJWE1FIC0gcmVhY2hvdmVyIC0gdGhpcyB3aG9sZSBoYW5kbGVyXG5cdFx0ICBsZXQgbHN0ID0gdGhpcy5hcHAubGlzdE1hbmFnZXIuY3JlYXRlTGlzdChsc3ROYW1lLCBmZWF0cy5tYXAoZiA9PiBmLnByaW1hcnlJZGVudGlmaWVyKSlcblx0XHQgIHRoaXMuYXBwLmxpc3RNYW5hZ2VyLnVwZGF0ZShsc3QpO1xuXHRcdCAgLy9cblx0XHQgIHRoaXMuYXBwLnpvb21WaWV3LmhpRmVhdHMgPSB7fTtcblx0XHQgIGZlYXRzLmZvckVhY2goZiA9PiB0aGlzLmFwcC56b29tVmlldy5oaUZlYXRzW2YuY2Fub25pY2FsXSA9IGYuY2Fub25pY2FsKTtcblx0XHQgIHRoaXMuYXBwLnpvb21WaWV3LmhpZ2hsaWdodCgpO1xuXHRcdCAgLy9cblx0XHQgIHRoaXMuYXBwLnNldEN1cnJlbnRMaXN0KGxzdCx0cnVlKTtcblx0XHQgIC8vXG5cdFx0ICBkMy5zZWxlY3QoXCIjbXlsaXN0c1wiKS5jbGFzc2VkKFwiYnVzeVwiLGZhbHNlKTtcblx0ICAgICAgfSk7XG5cdH0pXG4gICAgfVxufVxuXG5leHBvcnQgeyBRdWVyeU1hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL1F1ZXJ5TWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgeyBkM2pzb24sIGQzdGV4dCB9IGZyb20gJy4vdXRpbHMnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEF1eERhdGFNYW5hZ2VyIC0ga25vd3MgaG93IHRvIHF1ZXJ5IGFuIGV4dGVybmFsIHNvdXJjZSAoaS5lLiwgTW91c2VNaW5lKSBmb3IgZ2VuZXNcbi8vIGFubm90YXRlZCB0byBkaWZmZXJlbnQgb250b2xvZ2llcyBhbmQgZm9yIGV4b25zIGFzc29jaWF0ZWQgd2l0aCBzcGVjaWZpYyBnZW5lcyBvciByZWdpb25zLlxuY2xhc3MgQXV4RGF0YU1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcblx0dGhpcy5jZmcgPSBjb25maWcuQXV4RGF0YU1hbmFnZXI7XG5cdGlmICghdGhpcy5jZmcuYWxsTWluZXNbdGhpcy5jZmcubW91c2VtaW5lXSkgXG5cdCAgICB0aHJvdyBcIlVua25vd24gbWluZSBuYW1lOiBcIiArIHRoaXMuY2ZnLm1vdXNlbWluZTtcblx0dGhpcy5iYXNlVXJsID0gdGhpcy5jZmcuYWxsTWluZXNbdGhpcy5jZmcubW91c2VtaW5lXTtcblx0Y29uc29sZS5sb2coXCJNb3VzZU1pbmUgdXJsOlwiLCB0aGlzLmJhc2VVcmwpO1xuICAgICAgICB0aGlzLnFVcmwgPSB0aGlzLmJhc2VVcmwgKyAnL3NlcnZpY2UvcXVlcnkvcmVzdWx0cz8nO1xuXHR0aGlzLnJVcmwgPSB0aGlzLmJhc2VVcmwgKyAnL3BvcnRhbC5kbz9jbGFzcz1TZXF1ZW5jZUZlYXR1cmUmZXh0ZXJuYWxpZHM9J1xuXHR0aGlzLmZhVXJsID0gdGhpcy5iYXNlVXJsICsgJy9zZXJ2aWNlL3F1ZXJ5L3Jlc3VsdHMvZmFzdGE/JztcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0QXV4RGF0YSAocSwgZm9ybWF0KSB7XG5cdC8vY29uc29sZS5sb2coJ1F1ZXJ5OiAnICsgcSk7XG5cdGZvcm1hdCA9IGZvcm1hdCB8fCAnanNvbm9iamVjdHMnO1xuXHRsZXQgcXVlcnkgPSBlbmNvZGVVUklDb21wb25lbnQocSk7XG5cdGxldCB1cmwgPSB0aGlzLnFVcmwgKyBgZm9ybWF0PSR7Zm9ybWF0fSZxdWVyeT0ke3F1ZXJ5fWA7XG5cdHJldHVybiBkM2pzb24odXJsKS50aGVuKGRhdGEgPT4gZGF0YS5yZXN1bHRzfHxbXSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaXNJZGVudGlmaWVyIChxKSB7XG4gICAgICAgIGxldCBwdHMgPSBxLnNwbGl0KCc6Jyk7XG4gICAgICAgIGlmIChwdHMubGVuZ3RoID09PSAyICYmIHB0c1sxXS5tYXRjaCgvXlswLTldKyQvKSlcblx0ICAgIHJldHVybiB0cnVlO1xuXHRpZiAocS50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoJ3ItbW11LScpKVxuXHQgICAgcmV0dXJuIHRydWU7XG5cdHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYWRkV2lsZGNhcmRzIChxKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5pc0lkZW50aWZpZXIocSkgfHwgcS5pbmRleE9mKCcqJyk+PTApID8gcSA6IGAqJHtxfSpgO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBkbyBhIExPT0tVUCBxdWVyeSBmb3IgU2VxdWVuY2VGZWF0dXJlcyBmcm9tIE1vdXNlTWluZVxuICAgIGZlYXR1cmVzQnlMb29rdXAgKHFyeVN0cmluZykge1xuXHRsZXQgcSA9IGA8cXVlcnkgbmFtZT1cIlwiIG1vZGVsPVwiZ2Vub21pY1wiIFxuXHQgICAgdmlldz1cIlNlcXVlbmNlRmVhdHVyZS5wcmltYXJ5SWRlbnRpZmllciBTZXF1ZW5jZUZlYXR1cmUuc3ltYm9sXCIgXG5cdCAgICBjb25zdHJhaW50TG9naWM9XCJBIGFuZCBCIGFuZCBDXCI+XG5cdFx0PGNvbnN0cmFpbnQgY29kZT1cIkFcIiBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlXCIgb3A9XCJMT09LVVBcIiB2YWx1ZT1cIiR7cXJ5U3RyaW5nfVwiLz5cblx0XHQ8Y29uc3RyYWludCBjb2RlPVwiQlwiIHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUub3JnYW5pc20udGF4b25JZFwiIG9wPVwiPVwiIHZhbHVlPVwiMTAwOTBcIi8+XG5cdFx0PGNvbnN0cmFpbnQgY29kZT1cIkNcIiBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlLnNlcXVlbmNlT250b2xvZ3lUZXJtLm5hbWVcIiBvcD1cIiE9XCIgdmFsdWU9XCJ0cmFuc2dlbmVcIi8+XG5cdCAgICA8L3F1ZXJ5PmA7XG5cdHJldHVybiB0aGlzLmdldEF1eERhdGEocSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGZlYXR1cmVzQnlPbnRvbG9neVRlcm0gKHFyeVN0cmluZywgdGVybVR5cGVzKSB7XG5cdHFyeVN0cmluZyA9IHRoaXMuYWRkV2lsZGNhcmRzKHFyeVN0cmluZyk7XG4gICAgICAgIGxldCBxID0gYDxxdWVyeSBuYW1lPVwiXCIgbW9kZWw9XCJnZW5vbWljXCIgXG5cdCAgdmlldz1cIlNlcXVlbmNlRmVhdHVyZS5wcmltYXJ5SWRlbnRpZmllciBTZXF1ZW5jZUZlYXR1cmUuc3ltYm9sXCIgY29uc3RyYWludExvZ2ljPVwiQSBhbmQgQiBhbmQgQyBhbmQgRFwiPlxuXHQgICAgICA8Y29uc3RyYWludCBjb2RlPVwiQVwiIHBhdGg9XCJTZXF1ZW5jZUZlYXR1cmUub250b2xvZ3lBbm5vdGF0aW9ucy5vbnRvbG9neVRlcm0ucGFyZW50c1wiIG9wPVwiTE9PS1VQXCIgdmFsdWU9XCIke3FyeVN0cmluZ31cIi8+XG5cdCAgICAgIDxjb25zdHJhaW50IGNvZGU9XCJCXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5vcmdhbmlzbS50YXhvbklkXCIgb3A9XCI9XCIgdmFsdWU9XCIxMDA5MFwiLz5cblx0ICAgICAgPGNvbnN0cmFpbnQgY29kZT1cIkNcIiBwYXRoPVwiU2VxdWVuY2VGZWF0dXJlLnNlcXVlbmNlT250b2xvZ3lUZXJtLm5hbWVcIiBvcD1cIiE9XCIgdmFsdWU9XCJ0cmFuc2dlbmVcIi8+XG5cdCAgICAgIDxjb25zdHJhaW50IGNvZGU9XCJEXCIgcGF0aD1cIlNlcXVlbmNlRmVhdHVyZS5vbnRvbG9neUFubm90YXRpb25zLm9udG9sb2d5VGVybS5vbnRvbG9neS5uYW1lXCIgb3A9XCJPTkUgT0ZcIj5cblx0XHQgICR7IHRlcm1UeXBlcy5tYXAodHQ9PiAnPHZhbHVlPicrdHQrJzwvdmFsdWU+Jykuam9pbignJykgfVxuXHQgICAgICA8L2NvbnN0cmFpbnQ+XG5cdCAgPC9xdWVyeT5gXG5cdHJldHVybiB0aGlzLmdldEF1eERhdGEocSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGZlYXR1cmVzQnlQYXRod2F5VGVybSAocXJ5U3RyaW5nKSB7XG5cdHFyeVN0cmluZyA9IHRoaXMuYWRkV2lsZGNhcmRzKHFyeVN0cmluZyk7XG4gICAgICAgIGxldCBxID0gYDxxdWVyeSBuYW1lPVwiXCIgbW9kZWw9XCJnZW5vbWljXCIgXG5cdCAgdmlldz1cIkdlbmUucHJpbWFyeUlkZW50aWZpZXIgR2VuZS5zeW1ib2xcIiBjb25zdHJhaW50TG9naWM9XCJBIGFuZCBCXCI+XG5cdCAgICAgIDxjb25zdHJhaW50IHBhdGg9XCJHZW5lLnBhdGh3YXlzXCIgY29kZT1cIkFcIiBvcD1cIkxPT0tVUFwiIHZhbHVlPVwiJHtxcnlTdHJpbmd9XCIvPlxuXHQgICAgICA8Y29uc3RyYWludCBwYXRoPVwiR2VuZS5vcmdhbmlzbS50YXhvbklkXCIgY29kZT1cIkJcIiBvcD1cIj1cIiB2YWx1ZT1cIjEwMDkwXCIvPlxuXHQgIDwvcXVlcnk+YDtcblx0cmV0dXJuIHRoaXMuZ2V0QXV4RGF0YShxKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZmVhdHVyZXNCeUlkICAgICAgICAocXJ5U3RyaW5nKSB7IHJldHVybiB0aGlzLmZlYXR1cmVzQnlMb29rdXAocXJ5U3RyaW5nKTsgfVxuICAgIGZlYXR1cmVzQnlGdW5jdGlvbiAgKHFyeVN0cmluZykgeyByZXR1cm4gdGhpcy5mZWF0dXJlc0J5T250b2xvZ3lUZXJtKHFyeVN0cmluZywgW1wiR2VuZSBPbnRvbG9neVwiXSk7IH1cbiAgICBmZWF0dXJlc0J5UGhlbm90eXBlIChxcnlTdHJpbmcpIHsgcmV0dXJuIHRoaXMuZmVhdHVyZXNCeU9udG9sb2d5VGVybShxcnlTdHJpbmcsIFtcIk1hbW1hbGlhbiBQaGVub3R5cGVcIixcIkRpc2Vhc2UgT250b2xvZ3lcIl0pOyB9XG4gICAgZmVhdHVyZXNCeVBhdGh3YXkgICAocXJ5U3RyaW5nKSB7IHJldHVybiB0aGlzLmZlYXR1cmVzQnlQYXRod2F5VGVybShxcnlTdHJpbmcpOyB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyBhIHByb21pc2UgZm9yIGFsbCBleG9ucyBvZiBmZWF0dXJlcyBvdmVybGFwcGluZyBhIHNwZWNpZmllZCByYW5nZSBpbiB0aGUgc3BlY2lmZWQgZ2Vub21lLlxuICAgIGV4b25WaWV3ICgpIHtcblx0cmV0dXJuIFtcblx0ICAgICdFeG9uLmdlbmUuY2Fub25pY2FsLnByaW1hcnlJZGVudGlmaWVyJyxcblx0ICAgICdFeG9uLmdlbmUucHJpbWFyeUlkZW50aWZpZXInLFxuXHQgICAgJ0V4b24udHJhbnNjcmlwdHMucHJpbWFyeUlkZW50aWZpZXInLFxuXHQgICAgJ0V4b24ucHJpbWFyeUlkZW50aWZpZXInLFxuXHQgICAgJ0V4b24uY2hyb21vc29tZS5wcmltYXJ5SWRlbnRpZmllcicsXG5cdCAgICAnRXhvbi5jaHJvbW9zb21lTG9jYXRpb24uc3RhcnQnLFxuXHQgICAgJ0V4b24uY2hyb21vc29tZUxvY2F0aW9uLmVuZCcsXG5cdCAgICAnRXhvbi5zdHJhaW4ubmFtZSdcblx0XS5qb2luKCcgJyk7XG4gICAgfVxuICAgIC8vIFJldHVybnMgYSBwcm9taXNlIGZvciBhbGwgZXhvbnMgZnJvbSB0aGUgZ2l2ZW4gZ2Vub21lIHdoZXJlIHRoZSBleG9uJ3MgZ2VuZSBvdmVybGFwcyB0aGUgZ2l2ZW4gY29vcmRpbmF0ZXMuXG4gICAgZXhvbnNCeVJhbmdlXHQoZ2Vub21lLCBjaHIsIHN0YXJ0LCBlbmQpIHtcbiAgICAgICAgbGV0IHEgPSBgPHF1ZXJ5IG1vZGVsPVwiZ2Vub21pY1wiIHZpZXc9XCIke3RoaXMuZXhvblZpZXcoKX1cIiBjb25zdHJhaW50TG9naWM9XCJBIGFuZCBCXCI+XG5cdCAgICA8Y29uc3RyYWludCBjb2RlPVwiQVwiIHBhdGg9XCJFeG9uLmdlbmUuY2hyb21vc29tZUxvY2F0aW9uXCIgb3A9XCJPVkVSTEFQU1wiPlxuXHRcdDx2YWx1ZT4ke2Nocn06JHtzdGFydH0uLiR7ZW5kfTwvdmFsdWU+XG5cdCAgICA8L2NvbnN0cmFpbnQ+XG5cdCAgICA8Y29uc3RyYWludCBjb2RlPVwiQlwiIHBhdGg9XCJFeG9uLnN0cmFpbi5uYW1lXCIgb3A9XCI9XCIgdmFsdWU9XCIke2dlbm9tZX1cIi8+XG5cdCAgICA8L3F1ZXJ5PmBcblx0cmV0dXJuIHRoaXMuZ2V0QXV4RGF0YShxKTtcbiAgICB9XG4gICAgLy8gUmV0dXJucyBhIHByb21pc2UgZm9yIGFsbCBleG9ucyBvZiBhbGwgZ2Vub2xvZ3Mgb2YgdGhlIHNwZWNpZmllZCBjYW5vbmljYWwgZ2VuZVxuICAgIGV4b25zQnlDYW5vbmljYWxJZFx0KGlkZW50KSB7XG4gICAgICAgIGxldCBxID0gYDxxdWVyeSBtb2RlbD1cImdlbm9taWNcIiB2aWV3PVwiJHt0aGlzLmV4b25WaWV3KCl9XCIgPlxuXHQgICAgPGNvbnN0cmFpbnQgY29kZT1cIkFcIiBwYXRoPVwiRXhvbi5nZW5lLmNhbm9uaWNhbC5wcmltYXJ5SWRlbnRpZmllclwiIG9wPVwiPVwiIHZhbHVlPVwiJHtpZGVudH1cIiAvPlxuXHQgICAgPC9xdWVyeT5gXG5cdHJldHVybiB0aGlzLmdldEF1eERhdGEocSk7XG4gICAgfVxuICAgIC8vIFJldHVybnMgYSBwcm9taXNlIGZvciBhbGwgZXhvbnMgb2YgdGhlIHNwZWNpZmllZCBnZW5lLlxuICAgIGV4b25zQnlHZW5lSWRcdChpZGVudCkge1xuICAgICAgICBsZXQgcSA9IGA8cXVlcnkgbW9kZWw9XCJnZW5vbWljXCIgdmlldz1cIiR7dGhpcy5leG9uVmlldygpfVwiID5cblx0ICAgIDxjb25zdHJhaW50IGNvZGU9XCJBXCIgcGF0aD1cIkV4b24uZ2VuZS5wcmltYXJ5SWRlbnRpZmllclwiIG9wPVwiPVwiIHZhbHVlPVwiJHtpZGVudH1cIiAvPlxuXHQgICAgPC9xdWVyeT5gXG5cdHJldHVybiB0aGlzLmdldEF1eERhdGEocSk7XG4gICAgfVxuICAgIC8vIFJldHVybnMgYSBwcm9taXNlIGZvciBhbGwgZXhvbnMgb2YgdGhlIHNwZWNpZmllZCBnZW5lLlxuICAgIGV4b25zQnlHZW5lSWRzXHQoaWRlbnRzKSB7XG5cdGxldCB2YWxzID0gaWRlbnRzLm1hcChpID0+IGA8dmFsdWU+JHtpfTwvdmFsdWU+YCkuam9pbignJyk7XG4gICAgICAgIGxldCBxID0gYDxxdWVyeSBtb2RlbD1cImdlbm9taWNcIiB2aWV3PVwiJHt0aGlzLmV4b25WaWV3KCl9XCIgPlxuXHQgICAgPGNvbnN0cmFpbnQgY29kZT1cIkFcIiBwYXRoPVwiRXhvbi5nZW5lLnByaW1hcnlJZGVudGlmaWVyXCIgb3A9XCJPTkUgT0ZcIj4ke3ZhbHN9PC9jb25zdHJhaW50PlxuXHQgICAgPC9xdWVyeT5gXG5cdHJldHVybiB0aGlzLmdldEF1eERhdGEocSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIENvbnN0cnVjdHMgYSBVUkwgZm9yIGxpbmtpbmcgdG8gYSBNb3VzZU1pbmUgcmVwb3J0IHBhZ2UgYnkgaWRcbiAgICBsaW5rVG9SZXBvcnRQYWdlIChpZGVudCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yVXJsICsgaWRlbnQ7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIENvbnN0cnVjdHMgYSBVUkwgdG8gcmV0cmlldmUgbW91c2Ugc2VxdWVuY2VzIG9mIHRoZSBzcGVjaWZpZWQgdHlwZSBmb3IgdGhlIHNwZWNpZmllZCBmZWF0dXJlLlxuICAgIHNlcXVlbmNlc0ZvckZlYXR1cmUgKGYsIHR5cGUsIGdlbm9tZXMpIHtcblx0bGV0IHE7XG5cdGxldCB1cmw7XG5cdGxldCB2aWV3O1xuXHRsZXQgaWRlbnQ7XG4gICAgICAgIC8vXG5cdHR5cGUgPSB0eXBlID8gdHlwZS50b0xvd2VyQ2FzZSgpIDogJ2dlbm9taWMnO1xuXHQvL1xuXHRpZiAoZi5jYW5vbmljYWwpIHtcblx0ICAgIGlkZW50ID0gZi5jYW5vbmljYWxcblx0ICAgIC8vXG5cdCAgICBsZXQgZ3MgPSAnJ1xuXHQgICAgbGV0IHZhbHM7XG5cdCAgICBpZiAoZ2Vub21lcykge1xuXHRcdHZhbHMgPSBnZW5vbWVzLm1hcCgoZykgPT4gYDx2YWx1ZT4ke2d9PC92YWx1ZT5gKS5qb2luKCcnKTtcblx0ICAgIH1cblx0ICAgIHN3aXRjaCAodHlwZSkge1xuXHQgICAgY2FzZSAnZ2Vub21pYyc6XG5cdFx0dmlldyA9ICdHZW5lLmNhbm9uaWNhbC5wcmltYXJ5SWRlbnRpZmllcic7XG5cdFx0Z3MgPSBgPGNvbnN0cmFpbnQgcGF0aD1cIkdlbmUuc3RyYWluLm5hbWVcIiBvcD1cIk9ORSBPRlwiPiR7dmFsc308L2NvbnN0cmFpbnQ+YFxuXHRcdHEgPSBgPHF1ZXJ5IG5hbWU9XCJzZXF1ZW5jZXNCeUNhbm9uaWNhbElkXCIgbW9kZWw9XCJnZW5vbWljXCIgdmlldz1cIkdlbmUucHJpbWFyeUlkZW50aWZpZXJcIiA+XG5cdFx0ICAgIDxjb25zdHJhaW50IHBhdGg9XCJHZW5lLmNhbm9uaWNhbC5wcmltYXJ5SWRlbnRpZmllclwiIG9wPVwiPVwiIHZhbHVlPVwiJHtpZGVudH1cIi8+XG5cdFx0ICAgICR7Z3N9PC9xdWVyeT5gO1xuXHRcdGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICd0cmFuc2NyaXB0Jzpcblx0XHR2aWV3ID0gJ1RyYW5zY3JpcHQuZ2VuZS5jYW5vbmljYWwucHJpbWFyeUlkZW50aWZpZXInO1xuXHRcdGdzID0gYDxjb25zdHJhaW50IHBhdGg9XCJUcmFuc2NyaXB0LnN0cmFpbi5uYW1lXCIgb3A9XCJPTkUgT0ZcIj4ke3ZhbHN9PC9jb25zdHJhaW50PmBcblx0XHRxID0gYDxxdWVyeSBuYW1lPVwidHJhbnNjcmlwdFNlcXVlbmNlc0J5Q2Fub25pY2FsSWRcIiBtb2RlbD1cImdlbm9taWNcIiB2aWV3PVwiVHJhbnNjcmlwdC5wcmltYXJ5SWRlbnRpZmllclwiID5cblx0XHQgICAgPGNvbnN0cmFpbnQgcGF0aD1cIlRyYW5zY3JpcHQuZ2VuZS5jYW5vbmljYWwucHJpbWFyeUlkZW50aWZpZXJcIiBvcD1cIj1cIiB2YWx1ZT1cIiR7aWRlbnR9XCIvPlxuXHRcdCAgICAke2dzfTwvcXVlcnk+YDtcblx0ICAgICAgICBicmVhaztcblxuXHQgICAgY2FzZSAnZXhvbic6XG5cdFx0dmlldyA9ICdFeG9uLmdlbmUuY2Fub25pY2FsLnByaW1hcnlJZGVudGlmaWVyJztcblx0XHRncyA9IGA8Y29uc3RyYWludCBwYXRoPVwiRXhvbi5zdHJhaW4ubmFtZVwiIG9wPVwiT05FIE9GXCI+JHt2YWxzfTwvY29uc3RyYWludD5gXG5cdFx0cSA9IGA8cXVlcnkgbmFtZT1cImV4b25TZXF1ZW5jZXNCeUNhbm9uaWNhbElkXCIgbW9kZWw9XCJnZW5vbWljXCIgdmlldz1cIkV4b24ucHJpbWFyeUlkZW50aWZpZXJcIiA+XG5cdFx0ICAgIDxjb25zdHJhaW50IHBhdGg9XCJFeG9uLmdlbmUuY2Fub25pY2FsLnByaW1hcnlJZGVudGlmaWVyXCIgb3A9XCI9XCIgdmFsdWU9XCIke2lkZW50fVwiLz5cblx0XHQgICAgJHtnc308L3F1ZXJ5PmA7XG5cdCAgICAgICAgYnJlYWs7XG5cdCAgICBjYXNlICdjZHMnOlxuXHRcdHZpZXcgPSAnQ0RTLmdlbmUuY2Fub25pY2FsLnByaW1hcnlJZGVudGlmaWVyJztcblx0XHRncyA9IGA8Y29uc3RyYWludCBwYXRoPVwiQ0RTLnN0cmFpbi5uYW1lXCIgb3A9XCJPTkUgT0ZcIj4ke3ZhbHN9PC9jb25zdHJhaW50PmBcblx0XHRxID0gYDxxdWVyeSBuYW1lPVwiY2RzU2VxdWVuY2VzQnlDYW5vbmljYWxJZFwiIG1vZGVsPVwiZ2Vub21pY1wiIHZpZXc9XCJDRFMucHJpbWFyeUlkZW50aWZpZXJcIiA+XG5cdFx0ICAgIDxjb25zdHJhaW50IHBhdGg9XCJDRFMuZ2VuZS5jYW5vbmljYWwucHJpbWFyeUlkZW50aWZpZXJcIiBvcD1cIj1cIiB2YWx1ZT1cIiR7aWRlbnR9XCIvPlxuXHRcdCAgICAke2dzfTwvcXVlcnk+YDtcblx0ICAgICAgICBicmVhaztcblx0ICAgIH1cblx0fVxuXHRlbHNlIHtcblx0ICAgIGlkZW50ID0gZi5JRDtcblx0ICAgIHZpZXcgPSAnJ1xuXHQgICAgc3dpdGNoICh0eXBlKSB7XG5cdCAgICBjYXNlICdnZW5vbWljJzpcblx0XHRxID0gYDxxdWVyeSBuYW1lPVwic2VxdWVuY2VzQnlJZFwiIG1vZGVsPVwiZ2Vub21pY1wiIHZpZXc9XCJHZW5lLnByaW1hcnlJZGVudGlmaWVyXCIgPlxuXHRcdCAgICA8Y29uc3RyYWludCBwYXRoPVwiR2VuZS5wcmltYXJ5SWRlbnRpZmllclwiIG9wPVwiPVwiIHZhbHVlPVwiJHtpZGVudH1cIi8+XG5cdFx0ICA8L3F1ZXJ5PmA7XG5cdFx0YnJlYWs7XG4gICAgICAgICAgICBjYXNlICd0cmFuc2NyaXB0Jzpcblx0XHRxID0gYDxxdWVyeSBuYW1lPVwidHJhbnNjcmlwdFNlcXVlbmNlc0J5SWRcIiBtb2RlbD1cImdlbm9taWNcIiB2aWV3PVwiVHJhbnNjcmlwdC5wcmltYXJ5SWRlbnRpZmllclwiID5cblx0XHQgICAgPGNvbnN0cmFpbnQgcGF0aD1cIlRyYW5zY3JpcHQuZ2VuZS5wcmltYXJ5SWRlbnRpZmllclwiIG9wPVwiPVwiIHZhbHVlPVwiJHtpZGVudH1cIi8+XG5cdFx0ICA8L3F1ZXJ5PmA7XG5cdCAgICAgICAgYnJlYWs7XG5cdCAgICBjYXNlICdleG9uJzpcblx0XHRxID0gYDxxdWVyeSBuYW1lPVwiZXhvblNlcXVlbmNlc0J5SWRcIiBtb2RlbD1cImdlbm9taWNcIiB2aWV3PVwiRXhvbi5wcmltYXJ5SWRlbnRpZmllclwiID5cblx0XHQgICAgPGNvbnN0cmFpbnQgcGF0aD1cIkV4b24uZ2VuZS5wcmltYXJ5SWRlbnRpZmllclwiIG9wPVwiPVwiIHZhbHVlPVwiJHtpZGVudH1cIi8+XG5cdFx0ICA8L3F1ZXJ5PmA7XG5cdCAgICAgICAgYnJlYWs7XG5cdCAgICBjYXNlICdjZHMnOlxuXHRcdHEgPSBgPHF1ZXJ5IG5hbWU9XCJjZHNTZXF1ZW5jZXNCeUlkXCIgbW9kZWw9XCJnZW5vbWljXCIgdmlldz1cIkNEUy5wcmltYXJ5SWRlbnRpZmllclwiID5cblx0XHQgICAgPGNvbnN0cmFpbnQgcGF0aD1cIkNEUy5nZW5lLnByaW1hcnlJZGVudGlmaWVyXCIgb3A9XCI9XCIgdmFsdWU9XCIke2lkZW50fVwiLz5cblx0XHQgIDwvcXVlcnk+YDtcblx0ICAgICAgICBicmVhaztcblx0ICAgIH1cblx0fVxuXHRpZiAoIXEpIHJldHVybiBudWxsO1xuXHRjb25zb2xlLmxvZyhxLCB2aWV3KTtcblx0dXJsID0gdGhpcy5mYVVybCArIGBxdWVyeT0ke2VuY29kZVVSSUNvbXBvbmVudChxKX1gO1xuXHRpZiAodmlldylcbiAgICAgICAgICAgIHVybCArPSBgJnZpZXc9JHtlbmNvZGVVUklDb21wb25lbnQodmlldyl9YDtcblx0cmV0dXJuIHVybDtcbiAgICB9XG59XG5cbmV4cG9ydCB7IEF1eERhdGFNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9BdXhEYXRhTWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9Db21wb25lbnQnO1xuaW1wb3J0IHsgTGlzdEZvcm11bGFFdmFsdWF0b3IgfSBmcm9tICcuL0xpc3RGb3JtdWxhRXZhbHVhdG9yJztcbmltcG9ydCB7IEtleVN0b3JlIH0gZnJvbSAnLi9LZXlTdG9yZSc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gTWFpbnRhaW5zIG5hbWVkIGxpc3RzIG9mIElEcy4gTGlzdHMgbWF5IGJlIHRlbXBvcmFyeSwgbGFzdGluZyBvbmx5IGZvciB0aGUgc2Vzc2lvbiwgb3IgcGVybWFuZW50LFxuLy8gbGFzdGluZyB1bnRpbCB0aGUgdXNlciBjbGVhcnMgdGhlIGJyb3dzZXIgbG9jYWwgc3RvcmFnZSBhcmVhLlxuLy9cbi8vIFVzZXMgd2luZG93LnNlc3Npb25TdG9yYWdlIGFuZCB3aW5kb3cubG9jYWxTdG9yYWdlIHRvIHNhdmUgbGlzdHNcbi8vIHRlbXBvcmFyaWx5IG9yIHBlcm1hbmVudGx5LCByZXNwLiAgRklYTUU6IHNob3VsZCBiZSB1c2luZyB3aW5kb3cuaW5kZXhlZERCXG4vL1xuY2xhc3MgTGlzdE1hbmFnZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCkge1xuICAgICAgICBzdXBlcihhcHAsIGVsdCk7XG5cdHRoaXMubmFtZTJsaXN0ID0gbnVsbDtcblx0dGhpcy5saXN0U3RvcmUgPSBuZXcgS2V5U3RvcmUoJ3VzZXItbGlzdHMnKTtcblx0dGhpcy5mb3JtdWxhRXZhbCA9IG5ldyBMaXN0Rm9ybXVsYUV2YWx1YXRvcih0aGlzKTtcblx0dGhpcy5yZWFkeSA9IHRoaXMuX2xvYWQoKS50aGVuKCAoKT0+dGhpcy5pbml0RG9tKCkgKTtcbiAgICB9XG4gICAgaW5pdERvbSAoKSB7XG5cdC8vIEJ1dHRvbjogc2hvdy9oaWRlIHdhcm5pbmcgbWVzc2FnZVxuXHR0aGlzLnJvb3Quc2VsZWN0KCcuYnV0dG9uLndhcm5pbmcnKVxuXHQgICAgLm9uKCdjbGljaycsICgpID0+IHtcblx0ICAgICAgICBsZXQgdyA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwibWVzc2FnZVwiXScpO1xuXHRcdHcuY2xhc3NlZCgnc2hvd2luZycsICF3LmNsYXNzZWQoJ3Nob3dpbmcnKSk7XG5cdCAgICB9KTtcblx0Ly8gQnV0dG9uOiBjcmVhdGUgbGlzdCBmcm9tIGN1cnJlbnQgc2VsZWN0aW9uXG5cdHRoaXMucm9vdC5zZWxlY3QoJy5idXR0b25bbmFtZT1cIm5ld2Zyb21zZWxlY3Rpb25cIl0nKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdGxldCBpZHMgPSBuZXcgU2V0KE9iamVjdC5rZXlzKHRoaXMuYXBwLnpvb21WaWV3LmhpRmVhdHMpKTsgLy8gRklYTUUgLSByZWFjaG92ZXJcblx0XHRsZXQgbHN0ID0gdGhpcy5hcHAuZ2V0Q3VycmVudExpc3QoKTtcblx0XHRpZiAobHN0KVxuXHRcdCAgICBpZHMgPSBpZHMudW5pb24obHN0Lmlkcyk7XG5cdFx0aWYgKGlkcy5zaXplID09PSAwKSB7XG5cdFx0ICAgIGFsZXJ0KFwiTm90aGluZyBzZWxlY3RlZC5cIik7XG5cdFx0ICAgIHJldHVybjtcblx0XHR9XG5cdFx0bGV0IG5ld2xpc3QgPSB0aGlzLmNyZWF0ZUxpc3QoXCJzZWxlY3Rpb25cIiwgQXJyYXkuZnJvbShpZHMpKTtcblx0XHR0aGlzLnVwZGF0ZShuZXdsaXN0KTtcblx0ICAgIH0pO1xuXG5cdC8vIEJ1dHRvbjogY29tYmluZSBsaXN0czogb3BlbiBsaXN0IGVkaXRvciB3aXRoIGZvcm11bGEgZWRpdG9yIG9wZW5cblx0dGhpcy5yb290LnNlbGVjdCgnLmJ1dHRvbltuYW1lPVwiY29tYmluZVwiXScpXG5cdCAgICAub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0aWYgKHRoaXMuZ2V0TmFtZXMoKS5sZW5ndGggPT09IDApIHtcblx0XHQgICAgYWxlcnQoXCJObyBsaXN0cy5cIik7XG5cdFx0ICAgIHJldHVybjtcblx0XHR9XG5cdFx0bGV0IGxlID0gdGhpcy5hcHAubGlzdEVkaXRvcjtcblx0XHRsZS5vcGVuKCk7XG5cdFx0bGUub3BlbkZvcm11bGFFZGl0b3IoKTtcblx0ICAgIH0pO1xuXHQvLyBCdXR0b246IGRlbGV0ZSBhbGwgbGlzdHMgKGdldCBjb25maXJtYXRpb24gZmlyc3QpLlxuXHR0aGlzLnJvb3Quc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJwdXJnZVwiXScpXG5cdCAgICAub24oXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0aWYgKHRoaXMuZ2V0TmFtZXMoKS5sZW5ndGggPT09IDApIHtcblx0XHQgICAgYWxlcnQoXCJObyBsaXN0cy5cIik7XG5cdFx0ICAgIHJldHVybjtcblx0XHR9XG5cdCAgICAgICAgaWYgKHdpbmRvdy5jb25maXJtKFwiRGVsZXRlIGFsbCBsaXN0cy4gQXJlIHlvdSBzdXJlP1wiKSkge1xuXHRcdCAgICB0aGlzLnB1cmdlKCk7XG5cdFx0ICAgIHRoaXMudXBkYXRlKCk7XG5cdFx0fVxuXHQgICAgfSk7XG4gICAgfVxuICAgIF9sb2FkICgpIHtcblx0cmV0dXJuIHRoaXMubGlzdFN0b3JlLmdldChcImFsbFwiKS50aGVuKGFsbCA9PiB7XG5cdCAgICB0aGlzLm5hbWUybGlzdCA9IGFsbCB8fCB7fTtcblx0fSk7XG4gICAgfVxuICAgIF9zYXZlICgpIHtcblx0cmV0dXJuIHRoaXMubGlzdFN0b3JlLnNldChcImFsbFwiLCB0aGlzLm5hbWUybGlzdClcbiAgICB9XG4gICAgLy9cbiAgICAvLyByZXR1cm5zIHRoZSBuYW1lcyBvZiBhbGwgdGhlIGxpc3RzLCBzb3J0ZWRcbiAgICBnZXROYW1lcyAoKSB7XG4gICAgICAgIGxldCBubXMgPSBPYmplY3Qua2V5cyh0aGlzLm5hbWUybGlzdCk7XG5cdG5tcy5zb3J0KCk7XG5cdHJldHVybiBubXM7XG4gICAgfVxuICAgIC8vIHJldHVybnMgdHJ1ZSBpZmYgYSBsaXN0IGV4aXN0cyB3aXRoIHRoaXMgbmFtZVxuICAgIGhhcyAobmFtZSkge1xuICAgICAgICByZXR1cm4gbmFtZSBpbiB0aGlzLm5hbWUybGlzdDtcbiAgICB9XG4gICAgLy8gSWYgbm8gbGlzdCB3aXRoIHRoZSBnaXZlbiBuYW1lIGV4aXN0cywgcmV0dXJuIHRoZSBuYW1lLlxuICAgIC8vIE90aGVyd2lzZSwgcmV0dXJuIGEgbW9kaWZpZWQgdmVyc2lvbiBvZiBuYW1lIHRoYXQgaXMgdW5pcXVlLlxuICAgIC8vIFVuaXF1ZSBuYW1lcyBhcmUgY3JlYXRlZCBieSBhcHBlbmRpbmcgYSBjb3VudGVyLlxuICAgIC8vIEUuZy4sIHVuaXF1aWZ5KFwiZm9vXCIpIC0+IFwiZm9vLjFcIiBvciBcImZvby4yXCIgb3Igd2hhdGV2ZXIuXG4gICAgLy9cbiAgICB1bmlxdWlmeSAobmFtZSkge1xuXHRpZiAoIXRoaXMuaGFzKG5hbWUpKSBcblx0ICAgIHJldHVybiBuYW1lO1xuXHRmb3IgKGxldCBpID0gMTsgOyBpICs9IDEpIHtcblx0ICAgIGxldCBubiA9IGAke25hbWV9LiR7aX1gO1xuXHQgICAgaWYgKCF0aGlzLmhhcyhubikpXG5cdCAgICAgICAgcmV0dXJuIG5uO1xuXHR9XG4gICAgfVxuICAgIC8vIHJldHVybnMgdGhlIGxpc3Qgd2l0aCB0aGlzIG5hbWUsIG9yIG51bGwgaWYgbm8gc3VjaCBsaXN0XG4gICAgZ2V0IChuYW1lKSB7XG4gICAgICAgIGxldCBsc3QgPSB0aGlzLm5hbWUybGlzdFtuYW1lXTtcblx0aWYgKCFsc3QpIHRocm93IFwiTm8gc3VjaCBsaXN0OiBcIiArIG5hbWU7XG5cdHJldHVybiBsc3Q7XG4gICAgfVxuICAgIC8vIHJldHVybnMgYWxsIHRoZSBsaXN0cywgc29ydGVkIGJ5IG5hbWVcbiAgICBnZXRBbGwgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXROYW1lcygpLm1hcChuID0+IHRoaXMuZ2V0KG4pKVxuICAgIH1cbiAgICAvLyBcbiAgICBjcmVhdGVPclVwZGF0ZSAobmFtZSwgaWRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhcyhuYW1lKSA/IHRoaXMudXBkYXRlTGlzdChuYW1lLG51bGwsaWRzKSA6IHRoaXMuY3JlYXRlTGlzdChuYW1lLCBpZHMpO1xuICAgIH1cbiAgICAvLyBjcmVhdGVzIGEgbmV3IGxpc3Qgd2l0aCB0aGUgZ2l2ZW4gbmFtZSBhbmQgaWRzLlxuICAgIGNyZWF0ZUxpc3QgKG5hbWUsIGlkcywgZm9ybXVsYSkge1xuXHRpZiAobmFtZSAhPT0gXCJfXCIpXG5cdCAgICBuYW1lID0gdGhpcy51bmlxdWlmeShuYW1lKTtcblx0Ly9cblx0bGV0IGR0ID0gbmV3IERhdGUoKSArIFwiXCI7XG5cdHRoaXMubmFtZTJsaXN0W25hbWVdID0ge1xuXHQgICAgbmFtZTogICAgIG5hbWUsXG5cdCAgICBpZHM6ICAgICAgaWRzLFxuXHQgICAgZm9ybXVsYTogIGZvcm11bGEgfHwgXCJcIixcblx0ICAgIGNyZWF0ZWQ6ICBkdCxcblx0ICAgIG1vZGlmaWVkOiBkdFxuXHR9O1xuXHR0aGlzLl9zYXZlKCk7XG5cdHJldHVybiB0aGlzLm5hbWUybGlzdFtuYW1lXTtcbiAgICB9XG4gICAgLy8gUHJvdmlkZSBhY2Nlc3MgdG8gZXZhbHVhdGlvbiBzZXJ2aWNlXG4gICAgZXZhbEZvcm11bGEgKGV4cHIpIHtcblx0cmV0dXJuIHRoaXMuZm9ybXVsYUV2YWwuZXZhbChleHByKTtcbiAgICB9XG4gICAgLy8gUmVmcmVzaGVzIGEgbGlzdCBhbmQgcmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSByZWZyZXNoZWQgbGlzdC5cbiAgICAvLyBJZiB0aGUgbGlzdCBpZiBhIFBPTE8sIHByb21pc2UgcmVzb2x2ZXMgaW1tZWRpYXRlbHkgdG8gdGhlIGxpc3QuXG4gICAgLy8gT3RoZXJ3aXNlLCBzdGFydHMgYSByZWV2YWx1YXRpb24gb2YgdGhlIGZvcm11bGEgdGhhdCByZXNvbHZlcyBhZnRlciB0aGVcbiAgICAvLyBsaXN0J3MgaWRzIGhhdmUgYmVlbiB1cGRhdGVkLlxuICAgIC8vIElmIHRoZXJlIGlzIGFuIGVycm9yLCB0aGUgcmV0dXJuZWQgcHJvbWlzZSByZWplY3RzIHdpdGggdGhlIGVycm9yLlxuICAgIHJlZnJlc2hMaXN0IChuYW1lKSB7XG4gICAgICAgIGxldCBsc3QgPSB0aGlzLmdldChuYW1lKTtcblx0aWYgKCFsc3QpIHRocm93IFwiTm8gc3VjaCBsaXN0OiBcIiArIG5hbWU7XG5cdGxzdC5tb2RpZmllZCA9IFwiXCIrbmV3IERhdGUoKTtcblx0aWYgKCFsc3QuZm9ybXVsYSlcblx0ICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobHN0KTtcblx0ZWxzZSB7XG5cdCAgICBsZXQgcCA9IHRoaXMuZm9ybXVhbEV2YWwuZXZhbChsc3QuZm9ybXVsYSkudGhlbiggaWRzID0+IHtcblx0XHQgICAgbHN0LmlkcyA9IGlkcztcblx0XHQgICAgcmV0dXJuIGxzdDtcblx0XHR9KTtcblx0ICAgIHJldHVybiBwO1xuXHR9XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlcyB0aGUgaWRzIGluIHRoZSBnaXZlbiBsaXN0XG4gICAgdXBkYXRlTGlzdCAobmFtZSwgbmV3bmFtZSwgbmV3aWRzLCBuZXdmb3JtdWxhKSB7XG5cdGxldCBsc3QgPSB0aGlzLmdldChuYW1lKTtcbiAgICAgICAgaWYgKCEgbHN0KSB0aHJvdyBcIk5vIHN1Y2ggbGlzdDogXCIgKyBuYW1lO1xuXHRpZiAobmV3bmFtZSkge1xuXHQgICAgZGVsZXRlIHRoaXMubmFtZTJsaXN0W2xzdC5uYW1lXTtcblx0ICAgIGxzdC5uYW1lID0gdGhpcy51bmlxdWlmeShuZXduYW1lKTtcblx0ICAgIHRoaXMubmFtZTJsaXN0W2xzdC5uYW1lXSA9IGxzdDtcblx0fVxuXHRpZiAobmV3aWRzKSBsc3QuaWRzICA9IG5ld2lkcztcblx0aWYgKG5ld2Zvcm11bGEgfHwgbmV3Zm9ybXVsYT09PVwiXCIpIGxzdC5mb3JtdWxhID0gbmV3Zm9ybXVsYTtcblx0bHN0Lm1vZGlmaWVkID0gbmV3IERhdGUoKSArIFwiXCI7XG5cdHRoaXMuX3NhdmUoKTtcblx0cmV0dXJuIGxzdDtcbiAgICB9XG4gICAgLy8gZGVsZXRlcyB0aGUgc3BlY2lmaWVkIGxpc3RcbiAgICBkZWxldGVMaXN0IChuYW1lKSB7XG4gICAgICAgIGxldCBsc3QgPSB0aGlzLmdldChuYW1lKTtcblx0ZGVsZXRlIHRoaXMubmFtZTJsaXN0W25hbWVdO1xuXHR0aGlzLl9zYXZlKCk7XG5cdC8vIEZJWE1FOiB1c2UgZXZlbnRzISFcblx0aWYgKGxzdCA9PT0gdGhpcy5hcHAuZ2V0Q3VycmVudExpc3QoKSkgdGhpcy5hcHAuc2V0Q3VycmVudExpc3QobnVsbCk7XG5cdGlmIChsc3QgPT09IHRoaXMuYXBwLmxpc3RFZGl0b3IubGlzdCkgdGhpcy5hcHAubGlzdEVkaXRvci5saXN0ID0gbnVsbDtcblx0cmV0dXJuIGxzdDtcbiAgICB9XG4gICAgLy8gZGVsZXRlIGFsbCBsaXN0c1xuICAgIHB1cmdlICgpIHtcbiAgICAgICAgdGhpcy5uYW1lMmxpc3QgPSB7fVxuXHR0aGlzLl9zYXZlKCk7XG5cdC8vXG5cdHRoaXMuYXBwLnNldEN1cnJlbnRMaXN0KG51bGwpO1xuXHR0aGlzLmFwcC5saXN0RWRpdG9yLmxpc3QgPSBudWxsOyAvLyBGSVhNRSAtIHJlYWNoYWNyb3NzXG4gICAgfVxuICAgIC8vIFJldHVybnMgdHJ1ZSBpZmYgZXhwciBpcyB2YWxpZCwgd2hpY2ggbWVhbnMgaXQgaXMgYm90aCBzeW50YWN0aWNhbGx5IGNvcnJlY3QgXG4gICAgLy8gYW5kIGFsbCBtZW50aW9uZWQgbGlzdHMgZXhpc3QuXG4gICAgaXNWYWxpZCAoZXhwcikge1xuXHRyZXR1cm4gdGhpcy5mb3JtdWxhRXZhbC5pc1ZhbGlkKGV4cHIpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBVcGRhdGVzIHRoZSBcIk15IGxpc3RzXCIgYm94IHdpdGggdGhlIGN1cnJlbnRseSBhdmFpbGFibGUgbGlzdHMuXG4gICAgLy8gQXJnczpcbiAgICAvLyAgIG5ld2xpc3QgKExpc3QpIG9wdGlvbmFsLiBJZiBzcGVjaWZpZWQsIHdlIGp1c3QgY3JlYXRlZCB0aGF0IGxpc3QsIGFuZCBpdHMgbmFtZSBpc1xuICAgIC8vICAgXHRhIGdlbmVyYXRlZCBkZWZhdWx0LiBQbGFjZSBmb2N1cyB0aGVyZSBzbyB1c2VyIGNhbiB0eXBlIG5ldyBuYW1lLlxuICAgIHVwZGF0ZSAobmV3bGlzdCkge1xuXHRsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGxldCBsaXN0cyA9IHRoaXMuZ2V0QWxsKCk7XG5cdGxldCBieU5hbWUgPSAoYSxiKSA9PiB7XG5cdCAgICBsZXQgYW4gPSBhLm5hbWUudG9Mb3dlckNhc2UoKTtcblx0ICAgIGxldCBibiA9IGIubmFtZS50b0xvd2VyQ2FzZSgpO1xuXHQgICAgcmV0dXJuIChhbiA8IGJuID8gLTEgOiBhbiA+IGJuID8gKzEgOiAwKTtcblx0fTtcblx0bGV0IGJ5RGF0ZSA9IChhLGIpID0+ICgobmV3IERhdGUoYi5tb2RpZmllZCkpLmdldFRpbWUoKSAtIChuZXcgRGF0ZShhLm1vZGlmaWVkKSkuZ2V0VGltZSgpKTtcblx0bGlzdHMuc29ydChieU5hbWUpO1xuXHRsZXQgaXRlbXMgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImxpc3RzXCJdJykuc2VsZWN0QWxsKFwiLmxpc3RJbmZvXCIpXG5cdCAgICAuZGF0YShsaXN0cyk7XG5cdGxldCBuZXdpdGVtcyA9IGl0ZW1zLmVudGVyKCkuYXBwZW5kKFwiZGl2XCIpXG5cdCAgICAuYXR0cihcImNsYXNzXCIsXCJsaXN0SW5mbyBmbGV4cm93XCIpO1xuXG5cdG5ld2l0ZW1zLmFwcGVuZChcImlcIikuYXR0cihcImNsYXNzXCIsXCJtYXRlcmlhbC1pY29ucyBidXR0b25cIilcblx0ICAgIC5hdHRyKFwibmFtZVwiLFwiZWRpdFwiKVxuXHQgICAgLnRleHQoXCJtb2RlX2VkaXRcIilcblx0ICAgIC5hdHRyKFwidGl0bGVcIixcIkVkaXQgdGhpcyBsaXN0LlwiKTtcblxuXHRuZXdpdGVtcy5hcHBlbmQoXCJzcGFuXCIpLmF0dHIoXCJuYW1lXCIsXCJuYW1lXCIpO1xuXG5cdG5ld2l0ZW1zLmFwcGVuZChcInNwYW5cIikuYXR0cihcIm5hbWVcIixcInNpemVcIik7XG5cdG5ld2l0ZW1zLmFwcGVuZChcInNwYW5cIikuYXR0cihcIm5hbWVcIixcImRhdGVcIik7XG5cblx0bmV3aXRlbXMuYXBwZW5kKFwiaVwiKS5hdHRyKFwiY2xhc3NcIixcIm1hdGVyaWFsLWljb25zIGJ1dHRvblwiKVxuXHQgICAgLmF0dHIoXCJuYW1lXCIsXCJkZWxldGVcIilcblx0ICAgIC50ZXh0KFwiaGlnaGxpZ2h0X29mZlwiKVxuXHQgICAgLmF0dHIoXCJ0aXRsZVwiLFwiRGVsZXRlIHRoaXMgbGlzdC5cIik7XG5cblx0aWYgKG5ld2l0ZW1zWzBdWzBdKSB7XG5cdCAgICBsZXQgbGFzdCA9IG5ld2l0ZW1zWzBdW25ld2l0ZW1zWzBdLmxlbmd0aC0xXTtcblx0ICAgIGxhc3Quc2Nyb2xsSW50b1ZpZXcoKTtcblx0fVxuXG5cdGl0ZW1zXG5cdCAgICAuYXR0cihcIm5hbWVcIiwgbHN0PT5sc3QubmFtZSlcblx0ICAgIC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChsc3QpIHtcblx0XHRpZiAoZDMuZXZlbnQuYWx0S2V5KSB7XG5cdFx0ICAgIC8vIGFsdC1jbGljayBjb3BpZXMgdGhlIGxpc3QncyBuYW1lIGludG8gdGhlIGZvcm11bGEgZWRpdG9yXG5cdFx0ICAgIGxldCBsZSA9IHNlbGYuYXBwLmxpc3RFZGl0b3I7IC8vIEZJWE1FIHJlYWNob3ZlclxuXHRcdCAgICBsZXQgcyA9IGxzdC5uYW1lO1xuXHRcdCAgICBsZXQgcmUgPSAvWyA9KCkrKi1dLztcblx0XHQgICAgaWYgKHMuc2VhcmNoKHJlKSA+PSAwKVxuXHRcdFx0cyA9ICdcIicgKyBzICsgJ1wiJztcblx0XHQgICAgaWYgKCFsZS5pc0VkaXRpbmdGb3JtdWxhKSB7XG5cdFx0ICAgICAgICBsZS5vcGVuKCk7XG5cdFx0XHRsZS5vcGVuRm9ybXVsYUVkaXRvcigpO1xuXHRcdCAgICB9XG5cdFx0ICAgIC8vXG5cdFx0ICAgIGxlLmFkZFRvTGlzdEV4cHIocysnICcpO1xuXHRcdH1cblx0XHRlbHNlIGlmIChkMy5ldmVudC5zaGlmdEtleSkge1xuXHRcdCAgICAvLyBzaGlmdC1jbGljayBnb2VzIHRvIG5leHQgbGlzdCBlbGVtZW50IGlmIGl0J3MgdGhlIHNhbWUgbGlzdCxcblx0XHQgICAgLy8gb3IgZWxzZSBzZXRzIHRoZSBsaXN0IGFuZCBnb2VzIHRvIHRoZSBmaXJzdCBlbGVtZW50LlxuXHRcdCAgICBpZiAoc2VsZi5hcHAuZ2V0Q3VycmVudExpc3QoKSAhPT0gbHN0KVxuXHRcdFx0c2VsZi5hcHAuc2V0Q3VycmVudExpc3QobHN0LCB0cnVlKTtcblx0XHQgICAgZWxzZVxuXHRcdFx0c2VsZi5hcHAuZ29Ub05leHRMaXN0RWxlbWVudChsc3QpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHQgICAgLy8gcGxhaW4gY2xpY2sgc2V0cyB0aGUgc2V0IGlmIGl0J3MgYSBkaWZmZXJlbnQgbGlzdCxcblx0XHQgICAgLy8gb3IgZWxzZSB1bnNldHMgdGhlIGxpc3QuXG5cdFx0ICAgIGlmIChzZWxmLmFwcC5nZXRDdXJyZW50TGlzdCgpICE9PSBsc3QpXG5cdFx0ICAgICAgICBzZWxmLmFwcC5zZXRDdXJyZW50TGlzdChsc3QpO1xuXHRcdCAgICBlbHNlXG5cdFx0ICAgICAgICBzZWxmLmFwcC5zZXRDdXJyZW50TGlzdChudWxsKTtcblx0XHR9XG5cdCAgICB9KTtcblx0aXRlbXMuc2VsZWN0KCcuYnV0dG9uW25hbWU9XCJlZGl0XCJdJylcblx0ICAgIC8vIGVkaXQ6IGNsaWNrIFxuXHQgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24obHN0KSB7XG5cdCAgICAgICAgc2VsZi5hcHAubGlzdEVkaXRvci5vcGVuKGxzdCk7XG5cdCAgICB9KTtcblx0aXRlbXMuc2VsZWN0KCdzcGFuW25hbWU9XCJuYW1lXCJdJylcblx0ICAgIC50ZXh0KGxzdCA9PiBsc3QubmFtZSk7XG5cdGl0ZW1zLnNlbGVjdCgnc3BhbltuYW1lPVwiZGF0ZVwiXScpLnRleHQobHN0ID0+IHtcblx0ICAgIGxldCBtZCA9IG5ldyBEYXRlKGxzdC5tb2RpZmllZCk7XG5cdCAgICBsZXQgZCA9IGAke21kLmdldEZ1bGxZZWFyKCl9LSR7bWQuZ2V0TW9udGgoKSsxfS0ke21kLmdldERhdGUoKX0gYCBcblx0ICAgICAgICAgICsgYDoke21kLmdldEhvdXJzKCl9LiR7bWQuZ2V0TWludXRlcygpfS4ke21kLmdldFNlY29uZHMoKX1gO1xuXHQgICAgcmV0dXJuIGQ7XG5cdH0pO1xuXHRpdGVtcy5zZWxlY3QoJ3NwYW5bbmFtZT1cInNpemVcIl0nKS50ZXh0KGxzdCA9PiBsc3QuaWRzLmxlbmd0aCk7XG5cdGl0ZW1zLnNlbGVjdCgnLmJ1dHRvbltuYW1lPVwiZGVsZXRlXCJdJylcblx0ICAgIC5vbihcImNsaWNrXCIsIGxzdCA9PiB7XG5cdCAgICAgICAgdGhpcy5kZWxldGVMaXN0KGxzdC5uYW1lKTtcblx0XHR0aGlzLnVwZGF0ZSgpO1xuXG5cdFx0Ly8gTm90IHN1cmUgd2h5IHRoaXMgaXMgbmVjZXNzYXJ5IGhlcmUuIEJ1dCB3aXRob3V0IGl0LCB0aGUgbGlzdCBpdGVtIGFmdGVyIHRoZSBvbmUgYmVpbmdcblx0XHQvLyBkZWxldGVkIGhlcmUgd2lsbCByZWNlaXZlIGEgY2xpY2sgZXZlbnQuXG5cdFx0ZDMuZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0Ly9cblx0ICAgIH0pO1xuXG5cdC8vXG5cdGl0ZW1zLmV4aXQoKS5yZW1vdmUoKTtcblx0Ly9cblx0aWYgKG5ld2xpc3QpIHtcblx0ICAgIGxldCBsc3RlbHQgPSBcblx0ICAgICAgICBkMy5zZWxlY3QoYCNteWxpc3RzIFtuYW1lPVwibGlzdHNcIl0gW25hbWU9XCIke25ld2xpc3QubmFtZX1cIl1gKVswXVswXTtcbiAgICAgICAgICAgIGxzdGVsdC5zY3JvbGxJbnRvVmlldyhmYWxzZSk7XG5cdH1cbiAgICB9XG5cbn0gLy8gZW5kIGNsYXNzIExpc3RNYW5hZ2VyXG5cbmV4cG9ydCB7IExpc3RNYW5hZ2VyIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9MaXN0TWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gMTVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgTGlzdEZvcm11bGFQYXJzZXIgfSBmcm9tICcuL0xpc3RGb3JtdWxhUGFyc2VyJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBLbm93cyBob3cgdG8gcGFyc2UgYW5kIGV2YWx1YXRlIGEgbGlzdCBmb3JtdWxhIChha2EgbGlzdCBleHByZXNzaW9uKS5cbmNsYXNzIExpc3RGb3JtdWxhRXZhbHVhdG9yIHtcbiAgICBjb25zdHJ1Y3RvciAobGlzdE1hbmFnZXIpIHtcblx0dGhpcy5saXN0TWFuYWdlciA9IGxpc3RNYW5hZ2VyO1xuICAgICAgICB0aGlzLnBhcnNlciA9IG5ldyBMaXN0Rm9ybXVsYVBhcnNlcigpO1xuICAgIH1cbiAgICAvLyBFdmFsdWF0ZXMgdGhlIGV4cHJlc3Npb24gYW5kIHJldHVybnMgYSBQcm9taXNlIGZvciB0aGUgbGlzdCBvZiBpZHMuXG4gICAgLy8gSWYgdGhlcmUgaXMgYW4gZXJyb3IsIHRoZSBwcm9taXNlIHJlamVjdHMgd2l0aCB0aGUgZXJyb3IgbWVzc2FnZS5cbiAgICBldmFsIChleHByKSB7XG5cdCByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdCAgICAgdHJ5IHtcblx0XHRsZXQgYXN0ID0gdGhpcy5wYXJzZXIucGFyc2UoZXhwcik7XG5cdFx0bGV0IGxtID0gdGhpcy5saXN0TWFuYWdlcjtcblx0XHRsZXQgcmVhY2ggPSAobikgPT4ge1xuXHRcdCAgICBpZiAodHlwZW9mKG4pID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRsZXQgbHN0ID0gbG0uZ2V0KG4pO1xuXHRcdFx0aWYgKCFsc3QpIHRocm93IFwiTm8gc3VjaCBsaXN0OiBcIiArIG47XG5cdFx0XHRyZXR1cm4gbmV3IFNldChsc3QuaWRzKTtcblx0XHQgICAgfVxuXHRcdCAgICBlbHNlIHtcblx0XHRcdGxldCBsID0gcmVhY2gobi5sZWZ0KTtcblx0XHRcdGxldCByID0gcmVhY2gobi5yaWdodCk7XG5cdFx0XHRyZXR1cm4gbFtuLm9wXShyKTtcblx0XHQgICAgfVxuXHRcdH1cblx0XHRsZXQgaWRzID0gcmVhY2goYXN0KTtcblx0XHRyZXNvbHZlKEFycmF5LmZyb20oaWRzKSk7XG5cdCAgICB9XG5cdCAgICBjYXRjaCAoZSkge1xuXHRcdHJlamVjdChlKTtcblx0ICAgIH1cblx0IH0uYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIC8vIENoZWNrcyB0aGUgY3VycmVudCBleHByZXNzaW9uIGZvciBzeW50YWN0aWMgYW5kIHNlbWFudGljIHZhbGlkaXR5IGFuZCBzZXRzIHRoZSBcbiAgICAvLyB2YWxpZC9pbnZhbGlkIGNsYXNzIGFjY29yZGluZ2x5LiBTZW1hbnRpYyB2YWxpZGl0eSBzaW1wbHkgbWVhbnMgYWxsIG5hbWVzIGluIHRoZVxuICAgIC8vIGV4cHJlc3Npb24gYXJlIGJvdW5kLlxuICAgIC8vXG4gICAgaXNWYWxpZCAgKGV4cHIpIHtcblx0dHJ5IHtcblx0ICAgIC8vIGZpcnN0IGNoZWNrIHN5bnRheFxuXHQgICAgbGV0IGFzdCA9IHRoaXMucGFyc2VyLnBhcnNlKGV4cHIpO1xuXHQgICAgbGV0IGxtICA9IHRoaXMubGlzdE1hbmFnZXI7IFxuXHQgICAgLy8gbm93IGNoZWNrIGxpc3QgbmFtZXNcblx0ICAgIChmdW5jdGlvbiByZWFjaChuKSB7XG5cdFx0aWYgKHR5cGVvZihuKSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdCAgICBsZXQgbHN0ID0gbG0uZ2V0KG4pO1xuXHRcdCAgICBpZiAoIWxzdCkgdGhyb3cgXCJObyBzdWNoIGxpc3Q6IFwiICsgblxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHQgICAgcmVhY2gobi5sZWZ0KTtcblx0XHQgICAgcmVhY2gobi5yaWdodCk7XG5cdFx0fVxuXHQgICAgfSkoYXN0KTtcblxuXHQgICAgLy8gVGh1bWJzIHVwIVxuXHQgICAgcmV0dXJuIHRydWU7XG5cdH1cblx0Y2F0Y2ggKGUpIHtcblx0ICAgIC8vIHN5bnRheCBlcnJvciBvciB1bmtub3duIGxpc3QgbmFtZVxuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHR9XG4gICAgfVxufVxuXG5leHBvcnQgeyBMaXN0Rm9ybXVsYUV2YWx1YXRvciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvTGlzdEZvcm11bGFFdmFsdWF0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IHNldENhcmV0UG9zaXRpb24sIG1vdmVDYXJldFBvc2l0aW9uLCBnZXRDYXJldFJhbmdlIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudCc7XG5pbXBvcnQgeyBMaXN0Rm9ybXVsYVBhcnNlciB9IGZyb20gJy4vTGlzdEZvcm11bGFQYXJzZXInO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIExpc3RFZGl0b3IgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCkge1xuXHRzdXBlcihhcHAsIGVsdCk7XG5cdHRoaXMucGFyc2VyID0gbmV3IExpc3RGb3JtdWxhUGFyc2VyKCk7XG5cdHRoaXMuZm9ybSA9IG51bGw7XG5cdHRoaXMuaW5pdERvbSgpO1xuXHR0aGlzLmlzRWRpdGluZ0Zvcm11bGEgPSBmYWxzZTtcblx0Ly9cblx0dGhpcy5saXN0ID0gbnVsbDtcbiAgICB9XG4gICAgaW5pdERvbSAoKSB7XG5cdGxldCBzZWxmID0gdGhpcztcblx0dGhpcy5mb3JtID0gdGhpcy5yb290LnNlbGVjdChcImZvcm1cIilbMF1bMF07XG5cdGlmICghdGhpcy5mb3JtKSB0aHJvdyBcIkNvdWxkIG5vdCBpbml0IExpc3RFZGl0b3IuIE5vIGZvcm0gZWxlbWVudC5cIjtcblx0ZDMuc2VsZWN0KHRoaXMuZm9ybSlcblx0ICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0ICAgICAgICBsZXQgdCA9IGQzLmV2ZW50LnRhcmdldDtcblx0XHRpZiAoXCJidXR0b25cIiA9PT0gdC50YWdOYW1lLnRvTG93ZXJDYXNlKCkpe1xuXHRcdCAgICBkMy5ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdCAgICBsZXQgZiA9IHRoaXMuZm9ybTtcblx0XHQgICAgbGV0IHMgPSBmLmlkcy52YWx1ZS5yZXBsYWNlKC9bLHxdL2csICcgJykudHJpbSgpO1xuXHRcdCAgICBsZXQgaWRzID0gcyA/IHMuc3BsaXQoL1xccysvKSA6IFtdO1xuXHRcdCAgICAvLyBzYXZlIGxpc3Rcblx0XHQgICAgaWYgKHQubmFtZSA9PT0gXCJzYXZlXCIpIHtcblx0XHRcdGlmICghdGhpcy5saXN0KSByZXR1cm47XG5cdFx0XHR0aGlzLmxpc3QgPSB0aGlzLmFwcC5saXN0TWFuYWdlci51cGRhdGVMaXN0KHRoaXMubGlzdC5uYW1lLCBmLm5hbWUudmFsdWUsIGlkcywgZi5mb3JtdWxhLnZhbHVlKTtcblx0XHRcdHRoaXMuYXBwLmxpc3RNYW5hZ2VyLnVwZGF0ZSh0aGlzLmxpc3QpO1xuXHRcdCAgICB9XG5cdFx0ICAgIC8vIGNyZWF0ZSBuZXcgbGlzdFxuXHRcdCAgICBlbHNlIGlmICh0Lm5hbWUgPT09IFwibmV3XCIpIHtcblx0XHRcdGxldCBuID0gZi5uYW1lLnZhbHVlLnRyaW0oKTtcblx0XHRcdGlmICghbikge1xuXHRcdFx0ICAgYWxlcnQoXCJZb3VyIGxpc3QgaGFzIG5vIG5hbWUgYW5kIGlzIHZlcnkgc2FkLiBQbGVhc2UgZ2l2ZSBpdCBhIG5hbWUgYW5kIHRyeSBhZ2Fpbi5cIik7XG5cdFx0XHQgICByZXR1cm5cblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKG4uaW5kZXhPZignXCInKSA+PSAwKSB7XG5cdFx0XHQgICBhbGVydChcIk9oIGRlYXIsIHlvdXIgbGlzdCdzIG5hbWUgaGFzIGEgZG91YmxlIHF1b3RlIGNoYXJhY3RlciwgYW5kIEknbSBhZmFyYWlkIHRoYXQncyBub3QgYWxsb3dlZC4gUGxlYXNlIHJlbW92ZSB0aGUgJ1xcXCInIGFuZCB0cnkgYWdhaW4uXCIpO1xuXHRcdFx0ICAgcmV0dXJuXG5cdFx0XHR9XG5cdFx0ICAgICAgICB0aGlzLmxpc3QgPSB0aGlzLmFwcC5saXN0TWFuYWdlci5jcmVhdGVMaXN0KG4sIGlkcywgZi5mb3JtdWxhLnZhbHVlKTtcblx0XHRcdHRoaXMuYXBwLmxpc3RNYW5hZ2VyLnVwZGF0ZSh0aGlzLmxpc3QpO1xuXHRcdCAgICB9XG5cdFx0ICAgIC8vIGNsZWFyIGZvcm1cblx0XHQgICAgZWxzZSBpZiAodC5uYW1lID09PSBcImNsZWFyXCIpIHtcblx0XHQgICAgICAgIHRoaXMubGlzdCA9IG51bGw7XG5cdFx0ICAgIH1cblx0XHQgICAgLy8gZm9yd2FyZCB0byBNR0lcblx0XHQgICAgZWxzZSBpZiAodC5uYW1lID09PSBcInRvTWdpXCIpIHtcblx0XHQgICAgICAgIGxldCBmcm0gPSBkMy5zZWxlY3QoJyNtZ2liYXRjaGZvcm0nKVswXVswXTtcblx0XHRcdGZybS5pZHMudmFsdWUgPSBpZHMuam9pbihcIiBcIik7XG5cdFx0XHRmcm0uc3VibWl0KClcblx0XHQgICAgfVxuXHRcdCAgICAvLyBmb3J3YXJkIHRvIE1vdXNlTWluZVxuXHRcdCAgICBlbHNlIGlmICh0Lm5hbWUgPT09IFwidG9Nb3VzZU1pbmVcIikge1xuXHRcdCAgICAgICAgbGV0IGZybSA9IGQzLnNlbGVjdCgnI21vdXNlbWluZWZvcm0nKVswXVswXTtcblx0XHRcdGZybS5leHRlcm5hbGlkcy52YWx1ZSA9IGlkcy5qb2luKFwiLFwiKTtcblx0XHRcdGZybS5zdWJtaXQoKVxuXHRcdCAgICB9XG5cdFx0fVxuXHQgICAgfSk7XG5cblx0Ly8gQnV0dG9uOiBzaG93L2hpZGUgZm9ybXVsYSBlZGl0b3Jcblx0dGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJpZHNlY3Rpb25cIl0gLmJ1dHRvbltuYW1lPVwiZWRpdGZvcm11bGFcIl0nKVxuXHQgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy50b2dnbGVGb3JtdWxhRWRpdG9yKCkpO1xuXHQgICAgXG5cdC8vIElucHV0IGJveDogZm9ybXVsYTogdmFsaWRhdGUgb24gYW55IGlucHV0XG5cdHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSBbbmFtZT1cImZvcm11bGFcIl0nKVxuXHQgICAgLm9uKFwiaW5wdXRcIiwgKCkgPT4ge1xuXHQgICAgICAgIHRoaXMudmFsaWRhdGVFeHByKCk7XG5cdCAgICB9KTtcblxuXHQvLyBGb3J3YXJkIC0+IE1HSS9Nb3VzZU1pbmU6IGRpc2FibGUgYnV0dG9ucyBpZiBubyBpZHNcblx0dGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJpZHNcIl0nKVxuXHQgICAgLm9uKFwiaW5wdXRcIiwgKCkgPT4ge1xuXHQgICAgICAgIGxldCBlbXB0eSA9IHRoaXMuZm9ybS5pZHMudmFsdWUudHJpbSgpLmxlbmd0aCA9PT0gMDtcblx0XHR0aGlzLmZvcm0udG9NZ2kuZGlzYWJsZWQgPSB0aGlzLmZvcm0udG9Nb3VzZU1pbmUuZGlzYWJsZWQgPSBlbXB0eTtcblx0ICAgIH0pO1xuXG5cdC8vIEJ1dHRvbnM6IHRoZSBsaXN0IG9wZXJhdG9yIGJ1dHRvbnMgKHVuaW9uLCBpbnRlcnNlY3Rpb24sIGV0Yy4pXG5cdHRoaXMucm9vdC5zZWxlY3RBbGwoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSAuYnV0dG9uLmxpc3RvcCcpXG5cdCAgICAub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG5cdFx0Ly8gYWRkIG15IHN5bWJvbCB0byB0aGUgZm9ybXVsYVxuXHRcdGxldCBpbmVsdCA9IHNlbGYuZm9ybS5mb3JtdWxhO1xuXHRcdGxldCBvcCA9IGQzLnNlbGVjdCh0aGlzKS5hdHRyKFwibmFtZVwiKTtcblx0XHRzZWxmLmFkZFRvTGlzdEV4cHIob3ApO1xuXHRcdHNlbGYudmFsaWRhdGVFeHByKCk7XG5cdCAgICB9KTtcblxuXHQvLyBCdXR0b246IHJlZnJlc2ggYnV0dG9uIGZvciBydW5uaW5nIHRoZSBmb3JtdWxhXG5cdHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSAuYnV0dG9uW25hbWU9XCJyZWZyZXNoXCJdJylcbiAgICAgICAgICAgIC5vbihcImNsaWNrXCIsICgpID0+IHtcblx0XHRsZXQgZW1lc3NhZ2U9XCJJJ20gdGVycmlibHkgc29ycnksIGJ1dCB0aGVyZSBhcHBlYXJzIHRvIGJlIGEgcHJvYmxlbSB3aXRoIHlvdXIgbGlzdCBleHByZXNzaW9uOiBcIjtcblx0XHRsZXQgZm9ybXVsYSA9IHRoaXMuZm9ybS5mb3JtdWxhLnZhbHVlLnRyaW0oKTtcblx0XHRpZiAoZm9ybXVsYS5sZW5ndGggPT09IDApXG5cdFx0ICAgIHJldHVybjtcblx0ICAgICAgICB0aGlzLmFwcC5saXN0TWFuYWdlclxuXHRcdCAgICAuZXZhbEZvcm11bGEoZm9ybXVsYSlcblx0XHQgICAgLnRoZW4oaWRzID0+IHtcblx0XHQgICAgICAgIHRoaXMuZm9ybS5pZHMudmFsdWUgPSBpZHMuam9pbihcIlxcblwiKTtcblx0XHQgICAgIH0pXG5cdFx0ICAgIC5jYXRjaChlID0+IGFsZXJ0KGVtZXNzYWdlICsgZSkpO1xuXHQgICAgfSk7XG5cblx0Ly8gQnV0dG9uOiBjbG9zZSBmb3JtdWxhIGVkaXRvclxuXHR0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImZvcm11bGFlZGl0b3JcIl0gLmJ1dHRvbltuYW1lPVwiY2xvc2VcIl0nKVxuICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5jbG9zZUZvcm11bGFFZGl0b3IoKSApO1xuXHRcblx0Ly8gQ2xpY2tpbmcgdGhlIGJveCBjb2xsYXBzZSBidXR0b24gc2hvdWxkIGNsZWFyIHRoZSBmb3JtXG5cdHRoaXMucm9vdC5zZWxlY3QoXCIuYnV0dG9uLmNsb3NlXCIpXG5cdCAgICAub24oXCJjbGljay5leHRyYVwiLCAoKSA9PiB7XG5cdCAgICAgICAgdGhpcy5saXN0ID0gbnVsbDtcblx0XHR0aGlzLmNsb3NlRm9ybXVsYUVkaXRvcigpO1xuXHQgICAgfSk7XG4gICAgfVxuICAgIHBhcnNlSWRzIChzKSB7XG5cdHJldHVybiBzLnJlcGxhY2UoL1ssfF0vZywgJyAnKS50cmltKCkuc3BsaXQoL1xccysvKTtcbiAgICB9XG4gICAgZ2V0IGxpc3QgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGlzdDtcbiAgICB9XG4gICAgc2V0IGxpc3QgKGxzdCkge1xuICAgICAgICB0aGlzLl9saXN0ID0gbHN0O1xuXHR0aGlzLl9zeW5jRGlzcGxheSgpO1xuICAgIH1cbiAgICBfc3luY0Rpc3BsYXkgKCkge1xuXHRsZXQgbHN0ID0gdGhpcy5fbGlzdDtcblx0aWYgKCFsc3QpIHtcblx0ICAgIHRoaXMuZm9ybS5uYW1lLnZhbHVlID0gJyc7XG5cdCAgICB0aGlzLmZvcm0uaWRzLnZhbHVlID0gJyc7XG5cdCAgICB0aGlzLmZvcm0uaWRzLmRpc2FibGVkID0gZmFsc2U7XG5cdCAgICB0aGlzLmZvcm0ubW9kaWZpZWQudmFsdWUgPSAnJztcblx0ICAgIHRoaXMuZm9ybS5mb3JtdWxhLnZhbHVlID0gJyc7XG5cdCAgICB0aGlzLmZvcm0uc2F2ZS5kaXNhYmxlZCA9IHRydWU7XG5cdCAgICB0aGlzLmZvcm0udG9NZ2kuZGlzYWJsZWQgPSB0cnVlO1xuXHQgICAgdGhpcy5mb3JtLnRvTW91c2VNaW5lLmRpc2FibGVkID0gdHJ1ZTtcblx0fVxuXHRlbHNlIHtcblx0ICAgIHRoaXMuZm9ybS5uYW1lLnZhbHVlID0gbHN0Lm5hbWU7XG5cdCAgICB0aGlzLmZvcm0uaWRzLnZhbHVlID0gbHN0Lmlkcy5qb2luKCdcXG4nKTtcblx0ICAgIHRoaXMuZm9ybS5mb3JtdWxhLnZhbHVlID0gbHN0LmZvcm11bGEgfHwgXCJcIjtcblx0ICAgIHRoaXMuZm9ybS5pZHMuZGlzYWJsZWQgPSB0aGlzLmZvcm0uZm9ybXVsYS52YWx1ZS50cmltKCkubGVuZ3RoID4gMDtcblx0ICAgIHRoaXMuZm9ybS5tb2RpZmllZC52YWx1ZSA9IGxzdC5tb2RpZmllZDtcblx0ICAgIHRoaXMuZm9ybS5zYXZlLmRpc2FibGVkID0gZmFsc2U7XG5cdCAgICB0aGlzLmZvcm0udG9NZ2kuZGlzYWJsZWQgXG5cdCAgICAgID0gdGhpcy5mb3JtLnRvTW91c2VNaW5lLmRpc2FibGVkIFxuXHQgICAgICAgID0gKHRoaXMuZm9ybS5pZHMudmFsdWUudHJpbSgpLmxlbmd0aCA9PT0gMCk7XG5cdH1cblx0dGhpcy52YWxpZGF0ZUV4cHIoKTtcbiAgICB9XG4gICAgY2xlYXIgKCkge1xuICAgICAgICB0aGlzLmxpc3QgPSBudWxsO1xuICAgIH1cbiAgICBvcGVuIChsc3QpIHtcbiAgICAgICAgdGhpcy5saXN0ID0gbHN0O1xuXHR0aGlzLnJvb3QuY2xhc3NlZChcImNsb3NlZFwiLCBmYWxzZSk7XG4gICAgfVxuICAgIGNsb3NlICgpIHtcbiAgICAgICAgdGhpcy5saXN0ID0gbnVsbDtcblx0dGhpcy5yb290LmNsYXNzZWQoXCJjbG9zZWRcIiwgdHJ1ZSk7XG4gICAgfVxuICAgIG9wZW5Gb3JtdWxhRWRpdG9yICgpIHtcblx0dGhpcy5yb290LmNsYXNzZWQoXCJlZGl0aW5nZm9ybXVsYVwiLCB0cnVlKTtcblx0dGhpcy5pc0VkaXRpbmdGb3JtdWxhID0gdHJ1ZTtcblx0bGV0IGYgPSB0aGlzLmZvcm0uZm9ybXVsYS52YWx1ZTtcblx0dGhpcy5mb3JtLmZvcm11bGEuZm9jdXMoKTtcblx0c2V0Q2FyZXRQb3NpdGlvbih0aGlzLmZvcm0uZm9ybXVsYSwgZi5sZW5ndGgpO1xuICAgIH1cbiAgICBjbG9zZUZvcm11bGFFZGl0b3IgKCkge1xuXHR0aGlzLnJvb3QuY2xhc3NlZChcImVkaXRpbmdmb3JtdWxhXCIsIGZhbHNlKTtcblx0dGhpcy5pc0VkaXRpbmdGb3JtdWxhID0gZmFsc2U7XG4gICAgfVxuICAgIHRvZ2dsZUZvcm11bGFFZGl0b3IgKCkge1xuXHRsZXQgc2hvd2luZyA9IHRoaXMucm9vdC5jbGFzc2VkKFwiZWRpdGluZ2Zvcm11bGFcIik7XG5cdHNob3dpbmcgPyB0aGlzLmNsb3NlRm9ybXVsYUVkaXRvcigpIDogdGhpcy5vcGVuRm9ybXVsYUVkaXRvcigpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBDaGVja3MgdGhlIGN1cnJlbnQgZXhwcmVzc2lvbiBhbmQgc2V0cyB0aGUgdmFsaWQvaW52YWxpZCBjbGFzcy5cbiAgICB2YWxpZGF0ZUV4cHIgICgpIHtcblx0bGV0IGlucCA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiZm9ybXVsYWVkaXRvclwiXSBbbmFtZT1cImZvcm11bGFcIl0nKTtcblx0bGV0IGV4cHIgPSBpbnBbMF1bMF0udmFsdWUudHJpbSgpO1xuXHRpZiAoIWV4cHIpIHtcblx0ICAgIGlucC5jbGFzc2VkKFwidmFsaWRcIixmYWxzZSkuY2xhc3NlZChcImludmFsaWRcIixmYWxzZSk7XG4gXHQgICAgdGhpcy5mb3JtLmlkcy5kaXNhYmxlZCA9IGZhbHNlO1xuXHR9XG5cdGVsc2Uge1xuXHQgICAgbGV0IGlzVmFsaWQgPSB0aGlzLmFwcC5saXN0TWFuYWdlci5pc1ZhbGlkKGV4cHIpOyAvLyBGSVhNRSAtIHJlYWNob3ZlclxuXHQgICAgaW5wLmNsYXNzZWQoXCJ2YWxpZFwiLCBpc1ZhbGlkKS5jbGFzc2VkKFwiaW52YWxpZFwiLCAhaXNWYWxpZCk7XG4gXHQgICAgdGhpcy5mb3JtLmlkcy5kaXNhYmxlZCA9IHRydWU7XG5cdH1cbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgYWRkVG9MaXN0RXhwciAodGV4dCkge1xuXHRsZXQgaW5wID0gdGhpcy5yb290LnNlbGVjdCgnW25hbWU9XCJmb3JtdWxhZWRpdG9yXCJdIFtuYW1lPVwiZm9ybXVsYVwiXScpO1xuXHRsZXQgaWVsdCA9IGlucFswXVswXTtcblx0bGV0IHYgPSBpZWx0LnZhbHVlO1xuXHRsZXQgc3BsaWNlID0gZnVuY3Rpb24gKGUsdCl7XG5cdCAgICBsZXQgdiA9IGUudmFsdWU7XG5cdCAgICBsZXQgciA9IGdldENhcmV0UmFuZ2UoZSk7XG5cdCAgICBlLnZhbHVlID0gdi5zbGljZSgwLHJbMF0pICsgdCArIHYuc2xpY2UoclsxXSk7XG5cdCAgICBzZXRDYXJldFBvc2l0aW9uKGUsIHJbMF0rdC5sZW5ndGgpO1xuXHQgICAgZS5mb2N1cygpO1xuXHR9XG5cdGxldCByYW5nZSA9IGdldENhcmV0UmFuZ2UoaWVsdCk7XG5cdGlmIChyYW5nZVswXSA9PT0gcmFuZ2VbMV0pIHtcblx0ICAgIC8vIG5vIGN1cnJlbnQgc2VsZWN0aW9uXG5cdCAgICBzcGxpY2UoaWVsdCwgdGV4dCk7XG5cdCAgICBpZiAodGV4dCA9PT0gXCIoKVwiKSBcblx0XHRtb3ZlQ2FyZXRQb3NpdGlvbihpZWx0LCAtMSk7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICAvLyB0aGVyZSBpcyBhIGN1cnJlbnQgc2VsZWN0aW9uXG5cdCAgICBpZiAodGV4dCA9PT0gXCIoKVwiKVxuXHRcdC8vIHN1cnJvdW5kIGN1cnJlbnQgc2VsZWN0aW9uIHdpdGggcGFyZW5zLCB0aGVuIG1vdmUgY2FyZXQgYWZ0ZXJcblx0XHR0ZXh0ID0gJygnICsgdi5zbGljZShyYW5nZVswXSxyYW5nZVsxXSkgKyAnKSc7XG5cdCAgICBzcGxpY2UoaWVsdCwgdGV4dClcblx0fVxuXHR0aGlzLnZhbGlkYXRlRXhwcigpO1xuICAgIH1cbn0gLy8gZW5kIGNsYXNzIExpc3RFZGl0b3JcblxuZXhwb3J0IHsgTGlzdEVkaXRvciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvTGlzdEVkaXRvci5qc1xuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgRmFjZXQgfSBmcm9tICcuL0ZhY2V0JztcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBGYWNldE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yIChhcHApIHtcblx0dGhpcy5hcHAgPSBhcHA7XG5cdHRoaXMuZmFjZXRzID0gW107XG5cdHRoaXMubmFtZTJmYWNldCA9IHt9XG4gICAgfVxuICAgIGFkZEZhY2V0IChuYW1lLCB2YWx1ZUZjbikge1xuXHRpZiAodGhpcy5uYW1lMmZhY2V0W25hbWVdKSB0aHJvdyBcIkR1cGxpY2F0ZSBmYWNldCBuYW1lLiBcIiArIG5hbWU7XG5cdGxldCBmYWNldCA9IG5ldyBGYWNldChuYW1lLCB0aGlzLCB2YWx1ZUZjbik7XG4gICAgICAgIHRoaXMuZmFjZXRzLnB1c2goIGZhY2V0ICk7XG5cdHRoaXMubmFtZTJmYWNldFtuYW1lXSA9IGZhY2V0O1xuXHRyZXR1cm4gZmFjZXRcbiAgICB9XG4gICAgdGVzdCAoZikge1xuICAgICAgICBsZXQgdmFscyA9IHRoaXMuZmFjZXRzLm1hcCggZmFjZXQgPT4gZmFjZXQudGVzdChmKSApO1xuXHRyZXR1cm4gdmFscy5yZWR1Y2UoKGFjY3VtLCB2YWwpID0+IGFjY3VtICYmIHZhbCwgdHJ1ZSk7XG4gICAgfVxuICAgIGFwcGx5QWxsICgpIHtcblx0bGV0IHNob3cgPSBudWxsO1xuXHRsZXQgaGlkZSA9IFwibm9uZVwiO1xuXHQvLyBGSVhNRTogbWFqb3IgcmVhY2hvdmVyXG5cdHRoaXMuYXBwLnpvb21WaWV3LnN2Z01haW4uc2VsZWN0KFwiZy5zdHJpcHNcIikuc2VsZWN0QWxsKCcuZmVhdHVyZScpXG5cdCAgICAuc3R5bGUoXCJkaXNwbGF5XCIsIGYgPT4gdGhpcy50ZXN0KGYpID8gc2hvdyA6IGhpZGUpO1xuICAgIH1cbn0gLy8gZW5kIGNsYXNzIEZhY2V0TWFuYWdlclxuXG5leHBvcnQgeyBGYWNldE1hbmFnZXIgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vd3d3L2pzL0ZhY2V0TWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gMThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBGYWNldCB7XG4gICAgY29uc3RydWN0b3IgKG5hbWUsIG1hbmFnZXIsIHZhbHVlRmNuKSB7XG5cdHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG5cdHRoaXMudmFsdWVzID0gW107XG5cdHRoaXMudmFsdWVGY24gPSB2YWx1ZUZjbjtcbiAgICB9XG4gICAgc2V0VmFsdWVzICh2YWx1ZXMsIHF1aWV0bHkpIHtcbiAgICAgICAgdGhpcy52YWx1ZXMgPSB2YWx1ZXM7XG5cdGlmICghIHF1aWV0bHkpIHtcblx0ICAgIHRoaXMubWFuYWdlci5hcHBseUFsbCgpO1xuXHQgICAgdGhpcy5tYW5hZ2VyLmFwcC56b29tVmlldy5oaWdobGlnaHQoKTtcblx0fVxuICAgIH1cbiAgICB0ZXN0IChmKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy52YWx1ZXMgfHwgdGhpcy52YWx1ZXMubGVuZ3RoID09PSAwIHx8IHRoaXMudmFsdWVzLmluZGV4T2YoIHRoaXMudmFsdWVGY24oZikgKSA+PSAwO1xuICAgIH1cbn0gLy8gZW5kIGNsYXNzIEZhY2V0XG5cbmV4cG9ydCB7IEZhY2V0IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3d3dy9qcy9GYWNldC5qc1xuLy8gbW9kdWxlIGlkID0gMTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgZDN0c3YgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IEJsb2NrVHJhbnNsYXRvciB9IGZyb20gJy4vQmxvY2tUcmFuc2xhdG9yJztcbmltcG9ydCB7IEtleVN0b3JlIH0gZnJvbSAnLi9LZXlTdG9yZSc7XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQmxvY2tUcmFuc2xhdG9yIG1hbmFnZXIgY2xhc3MuIEZvciBhbnkgZ2l2ZW4gcGFpciBvZiBnZW5vbWVzLCBBIGFuZCBCLCBsb2FkcyB0aGUgc2luZ2xlIGJsb2NrIGZpbGVcbi8vIGZvciB0cmFuc2xhdGluZyBiZXR3ZWVuIHRoZW0sIGFuZCBpbmRleGVzIGl0IFwiZnJvbSBib3RoIGRpcmVjdGlvbnNcIjpcbi8vIFx0QS0+Qi0+IFtBQl9CbG9ja0ZpbGVdIDwtQTwtQlxuLy9cbmNsYXNzIEJUTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IgKGFwcCkge1xuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcblx0dGhpcy5yY0Jsb2NrcyA9IHt9O1xuXHR0aGlzLmJsb2NrU3RvcmUgPSBuZXcgS2V5U3RvcmUoJ3N5bnRlbnktYmxvY2tzJyk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcmVnaXN0ZXJCbG9ja3MgKGFHZW5vbWUsIGJHZW5vbWUsIGJsb2Nrcykge1xuXHRsZXQgYW5hbWUgPSBhR2Vub21lLm5hbWU7XG5cdGxldCBibmFtZSA9IGJHZW5vbWUubmFtZTtcblx0Y29uc29sZS5sb2coYFJlZ2lzdGVyaW5nIGJsb2NrczogJHthbmFtZX0gdnMgJHtibmFtZX1gLCBgI2Jsb2Nrcz0ke2Jsb2Nrcy5sZW5ndGh9YCk7XG5cdGxldCBibGtGaWxlID0gbmV3IEJsb2NrVHJhbnNsYXRvcihhR2Vub21lLGJHZW5vbWUsYmxvY2tzKTtcblx0aWYoICEgdGhpcy5yY0Jsb2Nrc1thbmFtZV0pIHRoaXMucmNCbG9ja3NbYW5hbWVdID0ge307XG5cdGlmKCAhIHRoaXMucmNCbG9ja3NbYm5hbWVdKSB0aGlzLnJjQmxvY2tzW2JuYW1lXSA9IHt9O1xuXHR0aGlzLnJjQmxvY2tzW2FuYW1lXVtibmFtZV0gPSBibGtGaWxlO1xuXHR0aGlzLnJjQmxvY2tzW2JuYW1lXVthbmFtZV0gPSBibGtGaWxlO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIExvYWRzIHRoZSBzeW50ZW55IGJsb2NrIGZpbGUgZm9yIGdlbm9tZXMgYUdlbm9tZSBhbmQgYkdlbm9tZS5cbiAgICAvLyBcbiAgICBnZXRCbG9ja0ZpbGUgKGFHZW5vbWUsIGJHZW5vbWUpIHtcblx0Ly8gQmUgYSBsaXR0bGUgc21hcnQgYWJvdXQgdGhlIG9yZGVyIHdlIHRyeSB0aGUgbmFtZXMuLi5cblx0aWYgKGJHZW5vbWUubmFtZSA8IGFHZW5vbWUubmFtZSkge1xuXHQgICAgbGV0IHRtcCA9IGFHZW5vbWU7IGFHZW5vbWUgPSBiR2Vub21lOyBiR2Vub21lID0gdG1wO1xuXHR9XG5cdC8vIEZpcnN0LCBzZWUgaWYgd2UgYWxyZWFkeSBoYXZlIHRoaXMgcGFpclxuXHRsZXQgYW5hbWUgPSBhR2Vub21lLm5hbWU7XG5cdGxldCBibmFtZSA9IGJHZW5vbWUubmFtZTtcblx0bGV0IGJmID0gKHRoaXMucmNCbG9ja3NbYW5hbWVdIHx8IHt9KVtibmFtZV07XG5cdGlmIChiZilcblx0ICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoYmYpO1xuXHRcblx0Ly8gU2Vjb25kLCB0cnkgbG9jYWwgZGlzayBjYWNoZVxuXHRsZXQga2V5ID0gYW5hbWUgKyAnLScgKyBibmFtZTtcblx0cmV0dXJuIHRoaXMuYmxvY2tTdG9yZS5nZXQoa2V5KS50aGVuKGRhdGEgPT4ge1xuXHQgICAgaWYgKGRhdGEpIHtcblx0XHRjb25zb2xlLmxvZyhcIkZvdW5kIGJsb2NrcyBpbiBjYWNoZS5cIik7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMucmVnaXN0ZXJCbG9ja3MoYUdlbm9tZSwgYkdlbm9tZSwgZGF0YSk7XG5cdCAgICB9XG5cdCAgICBlbHNlIGlmICh0aGlzLnNlcnZlclJlcXVlc3QpIHtcblx0ICAgICAgICAvLyBpZiB0aGVyZSBpcyBhbiBvdXRzdGFuZGluZyByZXF1ZXN0LCB3YWl0IHVudGlsIGl0J3MgZG9uZSBhbmQgdHJ5IGFnYWluLlxuXHRcdHRoaXMuc2VydmVyUmVxdWVzdC50aGVuKCgpPT50aGlzLmdldEJsb2NrRmlsZShhR2Vub21lLCBiR2Vub21lKSk7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0XHQvLyBUaGlyZCwgbG9hZCBmcm9tIHNlcnZlci5cblx0XHRsZXQgZm4gPSBgLi9kYXRhL2dlbm9tZWRhdGEvYmxvY2tzLnRzdmBcblx0XHRjb25zb2xlLmxvZyhcIlJlcXVlc3RpbmcgYmxvY2sgZmlsZSBmcm9tOiBcIiArIGZuKTtcblx0XHR0aGlzLnNlcnZlclJlcXVlc3QgPSBkM3RzdihmbikudGhlbihibG9ja3MgPT4ge1xuXHRcdCAgICBsZXQgcmJzID0gYmxvY2tzLnJlZHVjZSggKGEsYikgPT4ge1xuXHRcdCAgICBsZXQgayA9IGIuYUdlbm9tZSArICctJyArIGIuYkdlbm9tZTtcblx0XHQgICAgaWYgKCEoayBpbiBhKSkgYVtrXSA9IFtdO1xuXHRcdCAgICAgICAgYVtrXS5wdXNoKGIpO1xuXHRcdFx0cmV0dXJuIGE7XG5cdFx0ICAgIH0sIHt9KTtcblx0XHQgICAgZm9yIChsZXQgbiBpbiByYnMpIHtcblx0XHQgICAgICAgIHRoaXMuYmxvY2tTdG9yZS5zZXQobiwgcmJzW25dKTtcblx0XHQgICAgfVxuXHRcdH0pO1xuXHRcdHJldHVybiB0aGlzLnNlcnZlclJlcXVlc3Q7XG5cdCAgICB9XG5cdH0pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgYSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdoZW4gdGhlIHRyYW5zbGF0b3IgaGFzIGxvYWRlZCBhbGwgdGhlIGRhdGEgbmVlZGVkXG4gICAgLy8gZm9yIHRyYW5zbGF0aW5nIGNvb3JkaW5hdGVzIGJldHdlZW4gdGhlIGN1cnJlbnQgcmVmIHN0cmFpbiBhbmQgdGhlIGN1cnJlbnQgY29tcGFyaXNvbiBzdHJhaW5zLlxuICAgIC8vXG4gICAgcmVhZHkgKCkge1xuXHRsZXQgcHJvbWlzZXMgPSB0aGlzLmFwcC5jR2Vub21lcy5tYXAoY2cgPT4gdGhpcy5nZXRCbG9ja0ZpbGUodGhpcy5hcHAuckdlbm9tZSwgY2cpKTtcblx0cmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKVxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgdGhlIHN5bnRlbnkgYmxvY2sgdHJhbnNsYXRvciB0aGF0IG1hcHMgdGhlIGN1cnJlbnQgcmVmIGdlbm9tZSB0byB0aGUgc3BlY2lmaWVkIGNvbXBhcmlzb24gZ2Vub21lLlxuICAgIC8vXG4gICAgZ2V0QmxvY2tzIChmcm9tR2Vub21lLCB0b0dlbm9tZSkge1xuICAgICAgICBsZXQgYmxrVHJhbnMgPSB0aGlzLnJjQmxvY2tzW2Zyb21HZW5vbWUubmFtZV1bdG9HZW5vbWUubmFtZV07XG5cdHJldHVybiBibGtUcmFucy5nZXRCbG9ja3MoZnJvbUdlbm9tZSlcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBUcmFuc2xhdGVzIHRoZSBnaXZlbiBjb29yZGluYXRlIHJhbmdlIGZyb20gdGhlIHNwZWNpZmllZCBmcm9tR2Vub21lIHRvIHRoZSBzcGVjaWZpZWQgdG9HZW5vbWUuXG4gICAgLy8gUmV0dXJucyBhIGxpc3Qgb2YgemVybyBvciBtb3JlIGNvb3JkaW5hdGUgcmFuZ2VzIGluIHRoZSB0b0dlbm9tZS5cbiAgICAvL1xuICAgIHRyYW5zbGF0ZSAoZnJvbUdlbm9tZSwgY2hyLCBzdGFydCwgZW5kLCB0b0dlbm9tZSwgaW52ZXJ0ZWQpIHtcblx0Ly8gZ2V0IHRoZSByaWdodCBibG9jayBmaWxlXG5cdGxldCBibGtUcmFucyA9IHRoaXMucmNCbG9ja3NbZnJvbUdlbm9tZS5uYW1lXVt0b0dlbm9tZS5uYW1lXTtcblx0aWYgKCFibGtUcmFucykgdGhyb3cgXCJJbnRlcm5hbCBlcnJvci4gTm8gYmxvY2sgZmlsZSBmb3VuZCBpbiBpbmRleC5cIlxuXHQvLyB0cmFuc2xhdGUhXG5cdGxldCByYW5nZXMgPSBibGtUcmFucy50cmFuc2xhdGUoZnJvbUdlbm9tZSwgY2hyLCBzdGFydCwgZW5kLCBpbnZlcnRlZCk7XG5cdHJldHVybiByYW5nZXM7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNsZWFyQ2FjaGVkRGF0YSAoKSB7XG5cdGNvbnNvbGUubG9nKFwiQlRNYW5hZ2VyOiBDYWNoZSBjbGVhcmVkLlwiKVxuICAgICAgICByZXR1cm4gdGhpcy5ibG9ja1N0b3JlLmNsZWFyKCk7XG4gICAgfVxufSAvLyBlbmQgY2xhc3MgQlRNYW5hZ2VyXG5cbmV4cG9ydCB7IEJUTWFuYWdlciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvQlRNYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFNvbWV0aGluZyB0aGF0IGtub3dzIGhvdyB0byB0cmFuc2xhdGUgY29vcmRpbmF0ZXMgYmV0d2VlbiB0d28gZ2Vub21lcy5cbi8vXG4vL1xuY2xhc3MgQmxvY2tUcmFuc2xhdG9yIHtcbiAgICBjb25zdHJ1Y3RvcihhR2Vub21lLCBiR2Vub21lLCBibG9ja3Mpe1xuXHR0aGlzLmFHZW5vbWUgPSBhR2Vub21lO1xuXHR0aGlzLmJHZW5vbWUgPSBiR2Vub21lO1xuXHR0aGlzLmJsb2NrcyA9IGJsb2Nrcy5tYXAoYiA9PiB0aGlzLnByb2Nlc3NCbG9jayhiKSlcblx0dGhpcy5jdXJyU29ydCA9IFwiYVwiOyAvLyBlaXRoZXIgJ2EnIG9yICdiJ1xuICAgIH1cbiAgICBwcm9jZXNzQmxvY2sgKGJsaykgeyBcbiAgICAgICAgYmxrLmFJbmRleCA9IHBhcnNlSW50KGJsay5hSW5kZXgpO1xuICAgICAgICBibGsuYkluZGV4ID0gcGFyc2VJbnQoYmxrLmJJbmRleCk7XG4gICAgICAgIGJsay5hU3RhcnQgPSBwYXJzZUludChibGsuYVN0YXJ0KTtcbiAgICAgICAgYmxrLmJTdGFydCA9IHBhcnNlSW50KGJsay5iU3RhcnQpO1xuICAgICAgICBibGsuYUVuZCAgID0gcGFyc2VJbnQoYmxrLmFFbmQpO1xuICAgICAgICBibGsuYkVuZCAgID0gcGFyc2VJbnQoYmxrLmJFbmQpO1xuICAgICAgICBibGsuYUxlbmd0aCAgID0gcGFyc2VJbnQoYmxrLmFMZW5ndGgpO1xuICAgICAgICBibGsuYkxlbmd0aCAgID0gcGFyc2VJbnQoYmxrLmJMZW5ndGgpO1xuICAgICAgICBibGsuYmxvY2tDb3VudCAgID0gcGFyc2VJbnQoYmxrLmJsb2NrQ291bnQpO1xuICAgICAgICBibGsuYmxvY2tSYXRpbyAgID0gcGFyc2VGbG9hdChibGsuYmxvY2tSYXRpbyk7XG5cdGJsay5hYk1hcCA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdCAgICAuZG9tYWluKFtibGsuYVN0YXJ0LGJsay5hRW5kXSlcblx0ICAgIC5yYW5nZSggYmxrLmJsb2NrT3JpPT09XCItXCIgPyBbYmxrLmJFbmQsYmxrLmJTdGFydF0gOiBbYmxrLmJTdGFydCxibGsuYkVuZF0pO1xuXHRibGsuYmFNYXAgPSBibGsuYWJNYXAuaW52ZXJ0XG5cdHJldHVybiBibGs7XG4gICAgfVxuICAgIHNldFNvcnQgKHdoaWNoKSB7XG5cdGlmICh3aGljaCAhPT0gJ2EnICYmIHdoaWNoICE9PSAnYicpIHRocm93IFwiQmFkIGFyZ3VtZW50OlwiICsgd2hpY2g7XG5cdGxldCBzb3J0Q29sID0gd2hpY2ggKyBcIkluZGV4XCI7XG5cdGxldCBjbXAgPSAoeCx5KSA9PiB4W3NvcnRDb2xdIC0geVtzb3J0Q29sXTtcblx0dGhpcy5ibG9ja3Muc29ydChjbXApO1xuXHR0aGlzLmN1cnJTb3J0ID0gd2hpY2g7XG4gICAgfVxuICAgIGZsaXBTb3J0ICgpIHtcblx0dGhpcy5zZXRTb3J0KHRoaXMuY3VyclNvcnQgPT09IFwiYVwiID8gXCJiXCIgOiBcImFcIik7XG4gICAgfVxuICAgIC8vIEdpdmVuIGEgZ2Vub21lIChlaXRoZXIgdGhlIGEgb3IgYiBnZW5vbWUpIGFuZCBhIGNvb3JkaW5hdGUgcmFuZ2UsXG4gICAgLy8gcmV0dXJucyB0aGUgZXF1aXZhbGVudCBjb29yZGluYXRlIHJhbmdlKHMpIGluIHRoZSBvdGhlciBnZW5vbWVcbiAgICB0cmFuc2xhdGUgKGZyb21HZW5vbWUsIGNociwgc3RhcnQsIGVuZCwgaW52ZXJ0KSB7XG5cdC8vXG5cdGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gc3RhcnQgOiBlbmQ7XG5cdC8vIGZyb20gPSBcImFcIiBvciBcImJcIiwgZGVwZW5kaW5nIG9uIHdoaWNoIGdlbm9tZSBpcyBnaXZlbi5cbiAgICAgICAgbGV0IGZyb20gPSAoZnJvbUdlbm9tZSA9PT0gdGhpcy5hR2Vub21lID8gXCJhXCIgOiBmcm9tR2Vub21lID09PSB0aGlzLmJHZW5vbWUgPyBcImJcIiA6IG51bGwpO1xuXHRpZiAoIWZyb20pIHRocm93IFwiQmFkIGFyZ3VtZW50LiBHZW5vbWUgbmVpdGhlciBBIG5vciBCLlwiO1xuXHQvLyB0byA9IFwiYlwiIG9yIFwiYVwiLCBvcHBvc2l0ZSBvZiBmcm9tXG5cdGxldCB0byA9IChmcm9tID09PSBcImFcIiA/IFwiYlwiIDogXCJhXCIpO1xuXHQvLyBtYWtlIHN1cmUgdGhlIGJsb2NrcyBhcmUgc29ydGVkIGJ5IHRoZSBmcm9tIGdlbm9tZVxuXHR0aGlzLnNldFNvcnQoZnJvbSk7XG5cdC8vXG5cdGxldCBmcm9tQyA9IGZyb20rXCJDaHJcIjtcblx0bGV0IGZyb21TID0gZnJvbStcIlN0YXJ0XCI7XG5cdGxldCBmcm9tRSA9IGZyb20rXCJFbmRcIjtcblx0bGV0IGZyb21JID0gZnJvbStcIkluZGV4XCI7XG5cdGxldCB0b0MgPSB0bytcIkNoclwiO1xuXHRsZXQgdG9TID0gdG8rXCJTdGFydFwiO1xuXHRsZXQgdG9FID0gdG8rXCJFbmRcIjtcblx0bGV0IHRvSSA9IHRvK1wiSW5kZXhcIjtcblx0bGV0IG1hcHBlciA9IGZyb20rdG8rXCJNYXBcIjtcblx0Ly8gXG5cdGxldCBibGtzID0gdGhpcy5ibG9ja3Ncblx0ICAgIC8vIEZpcnN0IGZpbHRlciBmb3IgYmxvY2tzIHRoYXQgb3ZlcmxhcCB0aGUgZ2l2ZW4gY29vcmRpbmF0ZSByYW5nZSBpbiB0aGUgZnJvbSBnZW5vbWVcblx0ICAgIC5maWx0ZXIoYmxrID0+IGJsa1tmcm9tQ10gPT09IGNociAmJiBibGtbZnJvbVNdIDw9IGVuZCAmJiBibGtbZnJvbUVdID49IHN0YXJ0KVxuXHQgICAgLy8gbWFwIGVhY2ggYmxvY2suIFxuXHQgICAgLm1hcChibGsgPT4ge1xuXHRcdC8vIGNvb3JkIHJhbmdlIG9uIHRoZSBmcm9tIHNpZGUuXG5cdFx0bGV0IHMgPSBNYXRoLm1heChzdGFydCwgYmxrW2Zyb21TXSk7XG5cdFx0bGV0IGUgPSBNYXRoLm1pbihlbmQsIGJsa1tmcm9tRV0pO1xuXHRcdC8vIGNvb3JkIHJhbmdlIG9uIHRoZSB0byBzaWRlLlxuXHRcdGxldCBzMiA9IE1hdGguY2VpbChibGtbbWFwcGVyXShzKSk7XG5cdFx0bGV0IGUyID0gTWF0aC5mbG9vcihibGtbbWFwcGVyXShlKSk7XG5cdCAgICAgICAgcmV0dXJuIGludmVydCA/IHtcblx0XHQgICAgY2hyOiAgIGJsa1tmcm9tQ10sXG5cdFx0ICAgIHN0YXJ0OiBzLFxuXHRcdCAgICBlbmQ6ICAgZSxcblx0XHQgICAgb3JpOiAgIGJsay5ibG9ja09yaSxcblx0XHQgICAgaW5kZXg6IGJsa1tmcm9tSV0sXG5cdFx0ICAgIC8vIGFsc28gcmV0dXJuIHRoZSBmcm9tR2Vub21lIGNvb3JkcyBmb3IgdGhpcyBwaWVjZSBvZiB0aGUgdHJhbnNsYXRpb25cblx0XHQgICAgZkNocjogICBibGtbdG9DXSxcblx0XHQgICAgZlN0YXJ0OiBNYXRoLm1pbihzMixlMiksXG5cdFx0ICAgIGZFbmQ6ICAgTWF0aC5tYXgoczIsZTIpLFxuXHRcdCAgICBmSW5kZXg6IGJsa1t0b0ldLFxuXHRcdCAgICAvLyBpbmNsdWRlIHRoZSBibG9jayBpZCBhbmQgZnVsbCBibG9jayBjb29yZHNcblx0XHQgICAgYmxvY2tJZDogYmxrLmJsb2NrSWQsXG5cdFx0ICAgIGJsb2NrU3RhcnQ6IGJsa1tmcm9tU10sXG5cdFx0ICAgIGJsb2NrRW5kOiBibGtbZnJvbUVdXG5cdFx0fSA6IHtcblx0XHQgICAgY2hyOiAgIGJsa1t0b0NdLFxuXHRcdCAgICBzdGFydDogTWF0aC5taW4oczIsZTIpLFxuXHRcdCAgICBlbmQ6ICAgTWF0aC5tYXgoczIsZTIpLFxuXHRcdCAgICBvcmk6ICAgYmxrLmJsb2NrT3JpLFxuXHRcdCAgICBpbmRleDogYmxrW3RvSV0sXG5cdFx0ICAgIC8vIGFsc28gcmV0dXJuIHRoZSBmcm9tR2Vub21lIGNvb3JkcyBmb3IgdGhpcyBwaWVjZSBvZiB0aGUgdHJhbnNsYXRpb25cblx0XHQgICAgZkNocjogICBibGtbZnJvbUNdLFxuXHRcdCAgICBmU3RhcnQ6IHMsXG5cdFx0ICAgIGZFbmQ6ICAgZSxcblx0XHQgICAgZkluZGV4OiBibGtbZnJvbUldLFxuXHRcdCAgICAvLyBpbmNsdWRlIHRoZSBibG9jayBpZCBhbmQgZnVsbCBibG9jayBjb29yZHNcblx0XHQgICAgYmxvY2tJZDogYmxrLmJsb2NrSWQsXG5cdFx0ICAgIGJsb2NrU3RhcnQ6IGJsa1t0b1NdLFxuXHRcdCAgICBibG9ja0VuZDogYmxrW3RvRV1cblx0XHR9O1xuXHQgICAgfSk7XG5cdGlmICghaW52ZXJ0KSB7XG5cdCAgICAvLyBMb29rIGZvciAxLWJsb2NrIGdhcHMgYW5kIGZpbGwgdGhlbSBpbi4gXG5cdCAgICBibGtzLnNvcnQoKGEsYikgPT4gYS5pbmRleCAtIGIuaW5kZXgpO1xuXHQgICAgbGV0IG5icyA9IFtdO1xuXHQgICAgYmxrcy5mb3JFYWNoKCAoYiwgaSkgPT4ge1xuXHRcdGlmIChpID09PSAwKSByZXR1cm47XG5cdFx0aWYgKGJsa3NbaV0uaW5kZXggLSBibGtzW2kgLSAxXS5pbmRleCA9PT0gMikge1xuXHRcdCAgICBsZXQgYmxrID0gdGhpcy5ibG9ja3MuZmlsdGVyKCBiID0+IGJbdG9JXSA9PT0gYmxrc1tpXS5pbmRleCAtIDEgKVswXTtcblx0XHQgICAgbmJzLnB1c2goe1xuXHRcdFx0Y2hyOiAgIGJsa1t0b0NdLFxuXHRcdFx0c3RhcnQ6IGJsa1t0b1NdLFxuXHRcdFx0ZW5kOiAgIGJsa1t0b0VdLFxuXHRcdFx0b3JpOiAgIGJsay5ibG9ja09yaSxcblx0XHRcdGluZGV4OiBibGtbdG9JXSxcblx0XHRcdC8vIGFsc28gcmV0dXJuIHRoZSBmcm9tR2Vub21lIGNvb3JkcyBmb3IgdGhpcyBwaWVjZSBvZiB0aGUgdHJhbnNsYXRpb25cblx0XHRcdGZDaHI6ICAgYmxrW2Zyb21DXSxcblx0XHRcdGZTdGFydDogYmxrW2Zyb21TXSxcblx0XHRcdGZFbmQ6ICAgYmxrW2Zyb21FXSxcblx0XHRcdGZJbmRleDogYmxrW2Zyb21JXSxcblx0XHRcdC8vIGluY2x1ZGUgdGhlIGJsb2NrIGlkIGFuZCBmdWxsIGJsb2NrIGNvb3Jkc1xuXHRcdFx0YmxvY2tJZDogYmxrLmJsb2NrSWQsXG5cdFx0XHRibG9ja1N0YXJ0OiBibGtbdG9TXSxcblx0XHRcdGJsb2NrRW5kOiBibGtbdG9FXVxuXHRcdCAgICB9KTtcblx0XHR9XG5cdCAgICB9KTtcblx0ICAgIGJsa3MgPSBibGtzLmNvbmNhdChuYnMpO1xuXHR9XG5cdGJsa3Muc29ydCgoYSxiKSA9PiBhLmZJbmRleCAtIGIuZkluZGV4KTtcblx0cmV0dXJuIGJsa3M7XG4gICAgfVxuICAgIC8vIEdpdmVuIGEgZ2Vub21lIChlaXRoZXIgdGhlIGEgb3IgYiBnZW5vbWUpXG4gICAgLy8gcmV0dXJucyB0aGUgYmxvY2tzIGZvciB0cmFuc2xhdGluZyB0byB0aGUgb3RoZXIgKGIgb3IgYSkgZ2Vub21lLlxuICAgIC8vXG4gICAgZ2V0QmxvY2tzIChmcm9tR2Vub21lKSB7XG5cdC8vIGZyb20gPSBcImFcIiBvciBcImJcIiwgZGVwZW5kaW5nIG9uIHdoaWNoIGdlbm9tZSBpcyBnaXZlbi5cbiAgICAgICAgbGV0IGZyb20gPSAoZnJvbUdlbm9tZSA9PT0gdGhpcy5hR2Vub21lID8gXCJhXCIgOiBmcm9tR2Vub21lID09PSB0aGlzLmJHZW5vbWUgPyBcImJcIiA6IG51bGwpO1xuXHRpZiAoIWZyb20pIHRocm93IFwiQmFkIGFyZ3VtZW50LiBHZW5vbWUgbmVpdGhlciBBIG5vciBCLlwiO1xuXHQvLyB0byA9IFwiYlwiIG9yIFwiYVwiLCBvcHBvc2l0ZSBvZiBmcm9tXG5cdGxldCB0byA9IChmcm9tID09PSBcImFcIiA/IFwiYlwiIDogXCJhXCIpO1xuXHQvLyBtYWtlIHN1cmUgdGhlIGJsb2NrcyBhcmUgc29ydGVkIGJ5IHRoZSBmcm9tIGdlbm9tZVxuXHR0aGlzLnNldFNvcnQoZnJvbSk7XG5cdC8vXG5cdGxldCBmcm9tQyA9IGZyb20rXCJDaHJcIjtcblx0bGV0IGZyb21TID0gZnJvbStcIlN0YXJ0XCI7XG5cdGxldCBmcm9tRSA9IGZyb20rXCJFbmRcIjtcblx0bGV0IGZyb21JID0gZnJvbStcIkluZGV4XCI7XG5cdGxldCB0b0MgPSB0bytcIkNoclwiO1xuXHRsZXQgdG9TID0gdG8rXCJTdGFydFwiO1xuXHRsZXQgdG9FID0gdG8rXCJFbmRcIjtcblx0bGV0IHRvSSA9IHRvK1wiSW5kZXhcIjtcblx0bGV0IG1hcHBlciA9IGZyb20rdG8rXCJNYXBcIjtcblx0Ly8gXG5cdGxldCBibGtzID0gdGhpcy5ibG9ja3Ncblx0ICAgIC5tYXAoYmxrID0+IHtcblx0ICAgICAgICByZXR1cm4ge1xuXHRcdCAgICBibG9ja0lkOiAgIGJsay5ibG9ja0lkLFxuXHRcdCAgICBvcmk6ICAgICAgIGJsay5ibG9ja09yaSxcblx0XHQgICAgZnJvbUNocjogICBibGtbZnJvbUNdLFxuXHRcdCAgICBmcm9tU3RhcnQ6IGJsa1tmcm9tU10sXG5cdFx0ICAgIGZyb21FbmQ6ICAgYmxrW2Zyb21FXSxcblx0XHQgICAgZnJvbUluZGV4OiBibGtbZnJvbUldLFxuXHRcdCAgICB0b0NocjogICAgIGJsa1t0b0NdLFxuXHRcdCAgICB0b1N0YXJ0OiAgIGJsa1t0b1NdLFxuXHRcdCAgICB0b0VuZDogICAgIGJsa1t0b0VdLFxuXHRcdCAgICB0b0luZGV4OiAgIGJsa1t0b0ldXG5cdFx0fTtcblx0ICAgIH0pXG5cdC8vIFxuXHRyZXR1cm4gYmxrcztcbiAgICB9XG59XG5cbmV4cG9ydCB7IEJsb2NrVHJhbnNsYXRvciB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvQmxvY2tUcmFuc2xhdG9yLmpzXG4vLyBtb2R1bGUgaWQgPSAyMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBTVkdWaWV3IH0gZnJvbSAnLi9TVkdWaWV3JztcbmltcG9ydCB7IGNvb3Jkc0FmdGVyVHJhbnNmb3JtIH0gZnJvbSAnLi91dGlscyc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgR2Vub21lVmlldyBleHRlbmRzIFNWR1ZpZXcge1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgICBzdXBlcihhcHAsIGVsdCwgd2lkdGgsIGhlaWdodCk7XG5cdHRoaXMub3BlbldpZHRoID0gdGhpcy5vdXRlcldpZHRoO1xuXHR0aGlzLm9wZW5IZWlnaHQ9IHRoaXMub3V0ZXJIZWlnaHQ7XG5cdHRoaXMudG90YWxDaHJXaWR0aCA9IDQwOyAvLyB0b3RhbCB3aWR0aCBvZiBvbmUgY2hyb21vc29tZSAoYmFja2JvbmUrYmxvY2tzK2ZlYXRzKVxuXHR0aGlzLmN3aWR0aCA9IDIwOyAgICAgICAgLy8gY2hyb21vc29tZSB3aWR0aFxuXHR0aGlzLnRpY2tMZW5ndGggPSAxMDtcdCAvLyBmZWF0dXJlIHRpY2sgbWFyayBsZW5ndGhcblx0dGhpcy5icnVzaENociA9IG51bGw7XHQgLy8gd2hpY2ggY2hyIGhhcyB0aGUgY3VycmVudCBicnVzaFxuXHR0aGlzLmJ3aWR0aCA9IHRoaXMuY3dpZHRoLzI7ICAvLyBibG9jayB3aWR0aFxuXHR0aGlzLmN1cnJCbG9ja3MgPSBudWxsO1xuXHR0aGlzLmN1cnJUaWNrcyA9IG51bGw7XG5cdHRoaXMuZ0Nocm9tb3NvbWVzID0gdGhpcy5zdmdNYWluLmFwcGVuZCgnZycpLmF0dHIoXCJuYW1lXCIsIFwiY2hyb21vc29tZXNcIik7XG5cdHRoaXMudGl0bGUgICAgPSB0aGlzLnN2Z01haW4uYXBwZW5kKCd0ZXh0JykuYXR0cihcImNsYXNzXCIsIFwidGl0bGVcIik7XG5cdHRoaXMuc2Nyb2xsQW1vdW50ID0gMDtcblx0Ly9cblx0dGhpcy5pbml0RG9tKCk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGZpdFRvV2lkdGggKHcpe1xuICAgICAgICBzdXBlci5maXRUb1dpZHRoKHcpO1xuXHR0aGlzLm9wZW5XaWR0aCA9IHRoaXMub3V0ZXJXaWR0aDtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW5pdERvbSAoKSB7XG5cdHRoaXMucm9vdC5zZWxlY3QoJy5idXR0b24uY2xvc2UnKVxuXHQgICAgLm9uKCdjbGljaycsICgpID0+IHRoaXMucmVkcmF3KCkpO1xuXHR0aGlzLnN2Zy5vbihcIndoZWVsXCIsICgpID0+IHtcblx0ICAgIGlmICghdGhpcy5yb290LmNsYXNzZWQoXCJjbG9zZWRcIikpIHJldHVybjtcblx0ICAgIHRoaXMuc2Nyb2xsV2hlZWwoZDMuZXZlbnQuZGVsdGFZKVxuXHQgICAgZDMuZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0fSk7XG5cdGxldCBzYnMgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cInN2Z2NvbnRhaW5lclwiXSA+IFtuYW1lPVwic2Nyb2xsYnV0dG9uc1wiXScpXG5cdHNicy5zZWxlY3QoJy5idXR0b25bbmFtZT1cInVwXCJdJykub24oXCJjbGlja1wiLCAoKSA9PiB0aGlzLnNjcm9sbENocm9tb3NvbWVzVXAoKSk7XG5cdHNicy5zZWxlY3QoJy5idXR0b25bbmFtZT1cImRuXCJdJykub24oXCJjbGlja1wiLCAoKSA9PiB0aGlzLnNjcm9sbENocm9tb3NvbWVzRG93bigpKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzZXRCcnVzaENvb3JkcyAoY29vcmRzKSB7XG5cdHRoaXMuY2xlYXJCcnVzaGVzKCk7XG5cdHRoaXMuZ0Nocm9tb3NvbWVzLnNlbGVjdChgLmNocm9tb3NvbWVbbmFtZT1cIiR7Y29vcmRzLmNocn1cIl0gZ1tuYW1lPVwiYnJ1c2hcIl1gKVxuXHQgIC5lYWNoKGZ1bmN0aW9uKGNocil7XG5cdCAgICBjaHIuYnJ1c2guZXh0ZW50KFtjb29yZHMuc3RhcnQsY29vcmRzLmVuZF0pO1xuXHQgICAgY2hyLmJydXNoKGQzLnNlbGVjdCh0aGlzKSk7XG5cdH0pO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBicnVzaHN0YXJ0IChjaHIpe1xuXHR0aGlzLmNsZWFyQnJ1c2hlcyhjaHIuYnJ1c2gpO1xuXHR0aGlzLmJydXNoQ2hyID0gY2hyO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGJydXNoZW5kICgpe1xuXHRpZighdGhpcy5icnVzaENocikgcmV0dXJuO1xuXHRsZXQgY2MgPSB0aGlzLmFwcC5jb29yZHM7XG5cdHZhciB4dG50ID0gdGhpcy5icnVzaENoci5icnVzaC5leHRlbnQoKTtcblx0aWYgKE1hdGguYWJzKHh0bnRbMF0gLSB4dG50WzFdKSA8PSAxMCl7XG5cdCAgICAvLyB1c2VyIGNsaWNrZWRcblx0ICAgIGxldCB3ID0gY2MuZW5kIC0gY2Muc3RhcnQgKyAxO1xuXHQgICAgeHRudFswXSAtPSB3LzI7XG5cdCAgICB4dG50WzFdICs9IHcvMjtcblx0fVxuXHRsZXQgY29vcmRzID0geyBjaHI6dGhpcy5icnVzaENoci5uYW1lLCBzdGFydDpNYXRoLmZsb29yKHh0bnRbMF0pLCBlbmQ6IE1hdGguZmxvb3IoeHRudFsxXSkgfTtcblx0dGhpcy5hcHAuc2V0Q29udGV4dChjb29yZHMpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNsZWFyQnJ1c2hlcyAoZXhjZXB0KXtcblx0dGhpcy5nQ2hyb21vc29tZXMuc2VsZWN0QWxsKCdbbmFtZT1cImJydXNoXCJdJykuZWFjaChmdW5jdGlvbihjaHIpe1xuXHQgICAgaWYgKGNoci5icnVzaCAhPT0gZXhjZXB0KSB7XG5cdFx0Y2hyLmJydXNoLmNsZWFyKCk7XG5cdFx0Y2hyLmJydXNoKGQzLnNlbGVjdCh0aGlzKSk7XG5cdCAgICB9XG5cdH0pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldFggKGNocikge1xuXHRsZXQgeCA9IHRoaXMuYXBwLnJHZW5vbWUueHNjYWxlKGNocik7XG5cdGlmIChpc05hTih4KSkgdGhyb3cgXCJ4IGlzIE5hTlwiXG5cdHJldHVybiB4O1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRZIChwb3MpIHtcblx0bGV0IHkgPSB0aGlzLmFwcC5yR2Vub21lLnlzY2FsZShwb3MpO1xuXHRpZiAoaXNOYU4oeSkpIHRocm93IFwieSBpcyBOYU5cIlxuXHRyZXR1cm4geTtcbiAgICB9XG4gICAgXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcmVkcmF3ICgpIHtcbiAgICAgICAgdGhpcy5kcmF3KHRoaXMuY3VyclRpY2tzLCB0aGlzLmN1cnJCbG9ja3MpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGRyYXcgKHRpY2tEYXRhLCBibG9ja0RhdGEpIHtcblx0dGhpcy5kcmF3Q2hyb21vc29tZXMoKTtcblx0dGhpcy5kcmF3QmxvY2tzKGJsb2NrRGF0YSk7XG5cdHRoaXMuZHJhd1RpY2tzKHRpY2tEYXRhKTtcblx0dGhpcy5kcmF3VGl0bGUoKTtcblx0dGhpcy5zZXRCcnVzaENvb3Jkcyh0aGlzLmFwcC5jb29yZHMpO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIERyYXdzIHRoZSBjaHJvbW9zb21lcyBvZiB0aGUgcmVmZXJlbmNlIGdlbm9tZS5cbiAgICAvLyBJbmNsdWRlcyBiYWNrYm9uZXMsIGxhYmVscywgYW5kIGJydXNoZXMuXG4gICAgLy8gVGhlIGJhY2tib25lcyBhcmUgZHJhd24gYXMgdmVydGljYWwgbGluZSBzZW1lbnRzLFxuICAgIC8vIGRpc3RyaWJ1dGVkIGhvcml6b250YWxseS4gT3JkZXJpbmcgaXMgZGVmaW5lZCBieVxuICAgIC8vIHRoZSBtb2RlbCAoR2Vub21lIG9iamVjdCkuXG4gICAgLy8gTGFiZWxzIGFyZSBkcmF3biBhYm92ZSB0aGUgYmFja2JvbmVzLlxuICAgIC8vXG4gICAgLy8gTW9kaWZpY2F0aW9uOlxuICAgIC8vIERyYXdzIHRoZSBzY2VuZSBpbiBvbmUgb2YgdHdvIHN0YXRlczogb3BlbiBvciBjbG9zZWQuXG4gICAgLy8gVGhlIG9wZW4gc3RhdGUgaXMgYXMgZGVzY3JpYmVkIC0gYWxsIGNocm9tb3NvbWVzIHNob3duLlxuICAgIC8vIEluIHRoZSBjbG9zZWQgc3RhdGU6IFxuICAgIC8vICAgICAqIG9ubHkgb25lIGNocm9tb3NvbWUgc2hvd3MgKHRoZSBjdXJyZW50IG9uZSlcbiAgICAvLyAgICAgKiBkcmF3biBob3Jpem9udGFsbHkgYW5kIHBvc2l0aW9uZWQgYmVzaWRlIHRoZSBcIkdlbm9tZSBWaWV3XCIgdGl0bGVcbiAgICAvL1xuICAgIGRyYXdDaHJvbW9zb21lcyAoKSB7XG5cdGxldCBzZWxmID0gdGhpcztcblxuXHRsZXQgcmcgPSB0aGlzLmFwcC5yR2Vub21lOyAvLyByZWYgZ2Vub21lXG5cdGxldCByQ2hycyA9IHJnLmNocm9tb3NvbWVzO1xuXG4gICAgICAgIC8vIENocm9tb3NvbWUgZ3JvdXBzXG5cdGxldCBjaHJzID0gdGhpcy5nQ2hyb21vc29tZXMuc2VsZWN0QWxsKFwiLmNocm9tb3NvbWVcIilcblx0ICAgIC5kYXRhKHJDaHJzLCBjID0+IGMubmFtZSk7XG5cdGxldCBuZXdjaHJzID0gY2hycy5lbnRlcigpLmFwcGVuZChcImdcIilcblx0ICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJjaHJvbW9zb21lXCIpXG5cdCAgICAuYXR0cihcIm5hbWVcIiwgYyA9PiBjLm5hbWUpO1xuXHRcblx0bmV3Y2hycy5hcHBlbmQoXCJ0ZXh0XCIpLmF0dHIoXCJuYW1lXCIsXCJsYWJlbFwiKTtcblx0bmV3Y2hycy5hcHBlbmQoXCJsaW5lXCIpLmF0dHIoXCJuYW1lXCIsXCJiYWNrYm9uZVwiKTtcblx0bmV3Y2hycy5hcHBlbmQoXCJnXCIpLmF0dHIoXCJuYW1lXCIsXCJzeW5CbG9ja3NcIik7XG5cdG5ld2NocnMuYXBwZW5kKFwiZ1wiKS5hdHRyKFwibmFtZVwiLFwidGlja3NcIik7XG5cdG5ld2NocnMuYXBwZW5kKFwiZ1wiKS5hdHRyKFwibmFtZVwiLFwiYnJ1c2hcIik7XG5cblxuXHRsZXQgY2xvc2VkID0gdGhpcy5yb290LmNsYXNzZWQoXCJjbG9zZWRcIik7XG5cdC8vIHNldCBkaXJlY3Rpb24gb2YgdGhlIHJlc2l6ZSBjdXJzb3IuXG5cdGNocnMuc2VsZWN0QWxsKCdnW25hbWU9XCJicnVzaFwiXSBnLnJlc2l6ZScpLnN0eWxlKCdjdXJzb3InLCBjbG9zZWQgPyAnZXctcmVzaXplJyA6ICducy1yZXNpemUnKVxuXHQvL1xuXHRpZiAoY2xvc2VkKSB7XG5cdCAgICAvLyBSZXNldCB0aGUgU1ZHIHNpemUgdG8gYmUgMS1jaHJvbW9zb21lIHdpZGUuXG5cdCAgICAvLyBUcmFuc2xhdGUgdGhlIGNocm9tb3NvbWVzIGdyb3VwIHNvIHRoYXQgdGhlIGN1cnJlbnQgY2hyb21vc29tZSBhcHBlYXJzIGluIHRoZSBzdmcgYXJlYS5cblx0ICAgIC8vIFR1cm4gaXQgOTAgZGVnLlxuXG5cdCAgICAvLyBTZXQgdGhlIGhlaWdodCBvZiB0aGUgU1ZHIGFyZWEgdG8gMSBjaHJvbW9zb21lJ3Mgd2lkdGhcblx0ICAgIHRoaXMuc2V0R2VvbSh7IGhlaWdodDogdGhpcy50b3RhbENocldpZHRoLCByb3RhdGlvbjogLTkwLCB0cmFuc2xhdGlvbjogWy10aGlzLnRvdGFsQ2hyV2lkdGgvMisxMCwzMF0gfSk7XG5cdCAgICAvLyBcblx0ICAgIGxldCBkZWx0YSA9IDEwO1xuXHQgICAgcmcueHNjYWxlID0gZDMuc2NhbGUub3JkaW5hbCgpXG5cdFx0IC5kb21haW4ockNocnMubWFwKGZ1bmN0aW9uKHgpe3JldHVybiB4Lm5hbWU7fSkpXG5cdFx0IC8vIGluIGNsb3NlZCBtb2RlLCB0aGUgY2hyb21vc29tZXMgaGF2ZSBmaXhlZCBzcGFjaW5nXG5cdFx0IC5yYW5nZVBvaW50cyhbZGVsdGEsIGRlbHRhK3RoaXMudG90YWxDaHJXaWR0aCoockNocnMubGVuZ3RoLTEpXSk7XG5cdCAgICAvL1xuXHQgICAgcmcueXNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcblx0XHQgLmRvbWFpbihbMSxyZy5tYXhsZW5dKVxuXHRcdCAucmFuZ2UoWzAsIHRoaXMud2lkdGhdKTtcblxuXHQgICAgLy8gdHJhbnNsYXRlIGVhY2ggY2hyb21vc29tZSBpbnRvIHBvc2l0aW9uXG5cdCAgICBjaHJzLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYyA9PiBgdHJhbnNsYXRlKCR7cmcueHNjYWxlKGMubmFtZSl9LCAwKWApO1xuICAgICAgICAgICAgLy8gdHJhbnNsYXRlIHRoZSBjaHJvbW9zb21lcyBncm91cC5cblx0ICAgIHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNUbygtcmcueHNjYWxlKHRoaXMuYXBwLmNvb3Jkcy5jaHIpKTtcblx0ICAgIHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNTbmFwKCk7XG5cdH1cblx0ZWxzZSB7XG5cdCAgICAvLyBXaGVuIG9wZW4sIGRyYXcgYWxsIHRoZSBjaHJvbW9zb21lcy4gRWFjaCBjaHJvbSBpcyBhIHZlcnRpY2FsIGxpbmUuXG5cdCAgICAvLyBDaHJvbXMgYXJlIGRpc3RyaWJ1dGVkIGV2ZW5seSBhY3Jvc3MgdGhlIGF2YWlsYWJsZSBob3Jpem9udGFsIHNwYWNlLlxuXHQgICAgdGhpcy5zZXRHZW9tKHsgd2lkdGg6IHRoaXMub3BlbldpZHRoLCBoZWlnaHQ6IHRoaXMub3BlbkhlaWdodCwgcm90YXRpb246IDAsIHRyYW5zbGF0aW9uOiBbMCwwXSB9KTtcblx0ICAgIC8vIFxuXHQgICAgcmcueHNjYWxlID0gZDMuc2NhbGUub3JkaW5hbCgpXG5cdFx0IC5kb21haW4ockNocnMubWFwKGZ1bmN0aW9uKHgpe3JldHVybiB4Lm5hbWU7fSkpXG5cdFx0IC8vIGluIGNsb3NlZCBtb2RlLCB0aGUgY2hyb21vc29tZXMgc3ByZWFkIHRvIGZpbGwgdGhlIHNwYWNlXG5cdFx0IC5yYW5nZVBvaW50cyhbMCwgdGhpcy5vcGVuV2lkdGggLSAzMF0sIDAuNSk7XG5cdCAgICByZy55c2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdCAuZG9tYWluKFsxLHJnLm1heGxlbl0pXG5cdFx0IC5yYW5nZShbMCwgdGhpcy5oZWlnaHRdKTtcblxuXHQgICAgLy8gdHJhbnNsYXRlIGVhY2ggY2hyb21vc29tZSBpbnRvIHBvc2l0aW9uXG5cdCAgICBjaHJzLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYyA9PiBgdHJhbnNsYXRlKCR7cmcueHNjYWxlKGMubmFtZSl9LCAwKWApO1xuICAgICAgICAgICAgLy8gdHJhbnNsYXRlIHRoZSBjaHJvbW9zb21lcyBncm91cC5cblx0ICAgIHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNUbygwKTtcblx0fVxuXG5cdHJDaHJzLmZvckVhY2goY2hyID0+IHtcblx0ICAgIHZhciBzYyA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdFx0LmRvbWFpbihbMSxjaHIubGVuZ3RoXSlcblx0XHQucmFuZ2UoWzAsIHJnLnlzY2FsZShjaHIubGVuZ3RoKV0pO1xuXHQgICAgY2hyLmJydXNoID0gZDMuc3ZnLmJydXNoKCkueShzYylcblx0ICAgICAgIC5vbihcImJydXNoc3RhcnRcIiwgY2hyID0+IHRoaXMuYnJ1c2hzdGFydChjaHIpKVxuXHQgICAgICAgLm9uKFwiYnJ1c2hlbmRcIiwgKCkgPT4gdGhpcy5icnVzaGVuZCgpKTtcblx0ICB9LCB0aGlzKTtcblxuXG4gICAgICAgIGNocnMuc2VsZWN0KCdbbmFtZT1cImxhYmVsXCJdJylcblx0ICAgIC50ZXh0KGM9PmMubmFtZSlcblx0ICAgIC5hdHRyKFwieFwiLCAwKSBcblx0ICAgIC5hdHRyKFwieVwiLCAtMilcblx0ICAgIDtcblxuXHRjaHJzLnNlbGVjdCgnW25hbWU9XCJiYWNrYm9uZVwiXScpXG5cdCAgICAuYXR0cihcIngxXCIsIDApXG5cdCAgICAuYXR0cihcInkxXCIsIDApXG5cdCAgICAuYXR0cihcIngyXCIsIDApXG5cdCAgICAuYXR0cihcInkyXCIsIGMgPT4gcmcueXNjYWxlKGMubGVuZ3RoKSlcblx0ICAgIDtcblx0ICAgXG5cdGNocnMuc2VsZWN0KCdbbmFtZT1cImJydXNoXCJdJylcblx0ICAgIC5lYWNoKGZ1bmN0aW9uKGQpe2QzLnNlbGVjdCh0aGlzKS5jYWxsKGQuYnJ1c2gpO30pXG5cdCAgICAuc2VsZWN0QWxsKCdyZWN0Jylcblx0ICAgICAuYXR0cignd2lkdGgnLDE2KVxuXHQgICAgIC5hdHRyKCd4JywgLTgpXG5cdCAgICA7XG5cblx0Y2hycy5leGl0KCkucmVtb3ZlKCk7XG5cdFxuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFNjcm9sbCB3aGVlbCBldmVudCBoYW5kbGVyLlxuICAgIHNjcm9sbFdoZWVsIChkeSkge1xuXHQvLyBBZGQgZHkgdG8gdG90YWwgc2Nyb2xsIGFtb3VudC4gVGhlbiB0cmFuc2xhdGUgdGhlIGNocm9tb3NvbWVzIGdyb3VwLlxuXHR0aGlzLnNjcm9sbENocm9tb3NvbWVzQnkoZHkpO1xuXHQvLyBBZnRlciBhIDIwMCBtcyBwYXVzZSBpbiBzY3JvbGxpbmcsIHNuYXAgdG8gbmVhcmVzdCBjaHJvbW9zb21lXG5cdHRoaXMudG91dCAmJiB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMudG91dCk7XG5cdHRoaXMudG91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpPT50aGlzLnNjcm9sbENocm9tb3NvbWVzU25hcCgpLCAyMDApO1xuICAgIH1cbiAgICBzY3JvbGxDaHJvbW9zb21lc1RvICh4KSB7XG4gICAgICAgIGlmICh4ID09PSB1bmRlZmluZWQpIHggPSB0aGlzLnNjcm9sbEFtb3VudDtcblx0dGhpcy5zY3JvbGxBbW91bnQgPSBNYXRoLm1heChNYXRoLm1pbih4LDE1KSwgLXRoaXMudG90YWxDaHJXaWR0aCAqICh0aGlzLmFwcC5yR2Vub21lLmNocm9tb3NvbWVzLmxlbmd0aC0xKSk7XG5cdHRoaXMuZ0Nocm9tb3NvbWVzLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgYHRyYW5zbGF0ZSgke3RoaXMuc2Nyb2xsQW1vdW50fSwwKWApO1xuICAgIH1cbiAgICBzY3JvbGxDaHJvbW9zb21lc0J5IChkeCkge1xuICAgICAgICB0aGlzLnNjcm9sbENocm9tb3NvbWVzVG8odGhpcy5zY3JvbGxBbW91bnQgKyBkeCk7XG4gICAgfVxuICAgIHNjcm9sbENocm9tb3NvbWVzU25hcCAoKSB7XG5cdGxldCBpID0gTWF0aC5yb3VuZCh0aGlzLnNjcm9sbEFtb3VudCAvIHRoaXMudG90YWxDaHJXaWR0aClcblx0dGhpcy5zY3JvbGxDaHJvbW9zb21lc1RvKGkqdGhpcy50b3RhbENocldpZHRoKTtcbiAgICB9XG4gICAgc2Nyb2xsQ2hyb21vc29tZXNVcCAoKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNCeSgtdGhpcy50b3RhbENocldpZHRoKTtcblx0dGhpcy5zY3JvbGxDaHJvbW9zb21lc1NuYXAoKTtcbiAgICB9XG4gICAgc2Nyb2xsQ2hyb21vc29tZXNEb3duICgpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxDaHJvbW9zb21lc0J5KHRoaXMudG90YWxDaHJXaWR0aCk7XG5cdHRoaXMuc2Nyb2xsQ2hyb21vc29tZXNTbmFwKCk7XG4gICAgfVxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGRyYXdUaXRsZSAoKSB7XG5cdGxldCByZWZnID0gdGhpcy5hcHAuckdlbm9tZS5sYWJlbDtcblx0bGV0IGJsb2NrZyA9IHRoaXMuY3VyckJsb2NrcyA/IFxuXHQgICAgdGhpcy5jdXJyQmxvY2tzLmNvbXAgIT09IHRoaXMuYXBwLnJHZW5vbWUgP1xuXHQgICAgICAgIHRoaXMuY3VyckJsb2Nrcy5jb21wLmxhYmVsXG5cdFx0OlxuXHRcdG51bGxcblx0ICAgIDpcblx0ICAgIG51bGw7XG5cdGxldCBsc3QgPSB0aGlzLmFwcC5jdXJyTGlzdCA/IHRoaXMuYXBwLmN1cnJMaXN0Lm5hbWUgOiBudWxsO1xuXG5cdHRoaXMucm9vdC5zZWxlY3QoXCJsYWJlbCBzcGFuLnRpdGxlXCIpLnRleHQocmVmZyk7XG5cblx0bGV0IGxpbmVzID0gW107XG5cdGJsb2NrZyAmJiBsaW5lcy5wdXNoKGBCbG9ja3MgdnMuICR7YmxvY2tnfWApO1xuXHRsc3QgJiYgbGluZXMucHVzaChgRmVhdHVyZXMgZnJvbSBsaXN0IFwiJHtsc3R9XCJgKTtcblx0bGV0IHN1YnQgPSBsaW5lcy5qb2luKFwiIDo6IFwiKTtcblx0dGhpcy5yb290LnNlbGVjdChcImxhYmVsIHNwYW4uc3VidGl0bGVcIikudGV4dCgoc3VidCA/IFwiOjogXCIgOiBcIlwiKSArIHN1YnQpO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIERyYXdzIHRoZSBvdXRsaW5lcyBvZiBzeW50ZW55IGJsb2NrcyBvZiB0aGUgcmVmIGdlbm9tZSB2cy5cbiAgICAvLyB0aGUgZ2l2ZW4gZ2Vub21lLlxuICAgIC8vIFBhc3NpbmcgbnVsbCBlcmFzZXMgYWxsIHN5bnRlbnkgYmxvY2tzLlxuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgZGF0YSA9PSB7IHJlZjpHZW5vbWUsIGNvbXA6R2Vub21lLCBibG9ja3M6IGxpc3Qgb2Ygc3ludGVueSBibG9ja3MgfVxuICAgIC8vICAgIEVhY2ggc2Jsb2NrID09PSB7IGJsb2NrSWQ6aW50LCBvcmk6Ky8tLCBmcm9tQ2hyLCBmcm9tU3RhcnQsIGZyb21FbmQsIHRvQ2hyLCB0b1N0YXJ0LCB0b0VuZCB9XG4gICAgZHJhd0Jsb2NrcyAoZGF0YSkge1xuXHQvL1xuICAgICAgICBsZXQgc2JncnBzID0gdGhpcy5nQ2hyb21vc29tZXMuc2VsZWN0QWxsKFwiLmNocm9tb3NvbWVcIikuc2VsZWN0KCdbbmFtZT1cInN5bkJsb2Nrc1wiXScpO1xuXHRpZiAoIWRhdGEgfHwgIWRhdGEuYmxvY2tzIHx8IGRhdGEuYmxvY2tzLmxlbmd0aCA9PT0gMCkge1xuXHQgICAgdGhpcy5jdXJyQmxvY2tzID0gbnVsbDtcblx0ICAgIHNiZ3Jwcy5odG1sKCcnKTtcblx0ICAgIHRoaXMuZHJhd1RpdGxlKCk7XG5cdCAgICByZXR1cm47XG5cdH1cblx0dGhpcy5jdXJyQmxvY2tzID0gZGF0YTtcblx0Ly8gcmVvcmdhbml6ZSBkYXRhIHRvIHJlZmxlY3QgU1ZHIHN0cnVjdHVyZSB3ZSB3YW50LCBpZSwgZ3JvdXBlZCBieSBjaHJvbW9zb21lXG4gICAgICAgIGxldCBkeCA9IGRhdGEuYmxvY2tzLnJlZHVjZSgoYSxzYikgPT4ge1xuXHRcdGlmICghYVtzYi5mcm9tQ2hyXSkgYVtzYi5mcm9tQ2hyXSA9IFtdO1xuXHRcdGFbc2IuZnJvbUNocl0ucHVzaChzYik7XG5cdFx0cmV0dXJuIGE7XG5cdCAgICB9LCB7fSk7XG5cdHNiZ3Jwcy5lYWNoKGZ1bmN0aW9uKGMpe1xuXHQgICAgZDMuc2VsZWN0KHRoaXMpLmRhdHVtKHtjaHI6IGMubmFtZSwgYmxvY2tzOiBkeFtjLm5hbWVdIHx8IFtdIH0pO1xuXHR9KTtcblxuXHRsZXQgYndpZHRoID0gMTA7XG4gICAgICAgIGxldCBzYmxvY2tzID0gc2JncnBzLnNlbGVjdEFsbCgncmVjdC5zYmxvY2snKS5kYXRhKGI9PmIuYmxvY2tzKTtcbiAgICAgICAgbGV0IG5ld2JzID0gc2Jsb2Nrcy5lbnRlcigpLmFwcGVuZCgncmVjdCcpLmF0dHIoJ2NsYXNzJywnc2Jsb2NrJyk7XG5cdHNibG9ja3Ncblx0ICAgIC5hdHRyKFwieFwiLCAtYndpZHRoLzIgKVxuXHQgICAgLmF0dHIoXCJ5XCIsIGIgPT4gdGhpcy5nZXRZKGIuZnJvbVN0YXJ0KSlcblx0ICAgIC5hdHRyKFwid2lkdGhcIiwgYndpZHRoKVxuXHQgICAgLmF0dHIoXCJoZWlnaHRcIiwgYiA9PiBNYXRoLm1heCgwLHRoaXMuZ2V0WShiLmZyb21FbmQgLSBiLmZyb21TdGFydCArIDEpKSlcblx0ICAgIC5jbGFzc2VkKFwiaW52ZXJzaW9uXCIsIGIgPT4gYi5vcmkgPT09IFwiLVwiKVxuXHQgICAgLmNsYXNzZWQoXCJ0cmFuc2xvY2F0aW9uXCIsIGIgPT4gYi5mcm9tQ2hyICE9PSBiLnRvQ2hyKVxuXHQgICAgO1xuXG4gICAgICAgIHNibG9ja3MuZXhpdCgpLnJlbW92ZSgpO1xuXG5cdHRoaXMuZHJhd1RpdGxlKCk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZHJhd1RpY2tzIChpZHMpIHtcblx0dGhpcy5jdXJyVGlja3MgPSBpZHMgfHwgW107XG5cdHRoaXMuYXBwLmZlYXR1cmVNYW5hZ2VyLmdldEZlYXR1cmVzQnlJZCh0aGlzLmFwcC5yR2Vub21lLCB0aGlzLmN1cnJUaWNrcylcblx0ICAgIC50aGVuKCBmZWF0cyA9PiB7IHRoaXMuX2RyYXdUaWNrcyhmZWF0cyk7IH0pO1xuICAgIH1cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBfZHJhd1RpY2tzIChmZWF0dXJlcykge1xuXHRsZXQgcmcgPSB0aGlzLmFwcC5yR2Vub21lOyAvLyByZWYgZ2Vub21lXG5cdC8vIGZlYXR1cmUgdGljayBtYXJrc1xuXHRpZiAoIWZlYXR1cmVzIHx8IGZlYXR1cmVzLmxlbmd0aCA9PT0gMCkge1xuXHQgICAgdGhpcy5nQ2hyb21vc29tZXMuc2VsZWN0QWxsKCdbbmFtZT1cInRpY2tzXCJdJykuc2VsZWN0QWxsKFwiLmZlYXR1cmVcIikucmVtb3ZlKCk7XG5cdCAgICByZXR1cm47XG5cdH1cblxuXHQvL1xuXHRsZXQgdEdycHMgPSB0aGlzLmdDaHJvbW9zb21lcy5zZWxlY3RBbGwoXCIuY2hyb21vc29tZVwiKS5zZWxlY3QoJ1tuYW1lPVwidGlja3NcIl0nKTtcblxuXHQvLyBncm91cCBmZWF0dXJlcyBieSBjaHJvbW9zb21lXG4gICAgICAgIGxldCBmaXggPSBmZWF0dXJlcy5yZWR1Y2UoKGEsZikgPT4geyBcblx0ICAgIGlmICghIGFbZi5jaHJdKSBhW2YuY2hyXSA9IFtdO1xuXHQgICAgYVtmLmNocl0ucHVzaChmKTtcblx0ICAgIHJldHVybiBhO1xuXHR9LCB7fSlcblx0dEdycHMuZWFjaChmdW5jdGlvbihjKSB7XG5cdCAgICBkMy5zZWxlY3QodGhpcykuZGF0dW0oIHsgY2hyOiBjLCBmZWF0dXJlczogZml4W2MubmFtZV0gIHx8IFtdfSApO1xuXHR9KTtcblxuXHQvLyB0aGUgdGljayBlbGVtZW50c1xuICAgICAgICBsZXQgZmVhdHMgPSB0R3Jwcy5zZWxlY3RBbGwoXCIuZmVhdHVyZVwiKVxuXHQgICAgLmRhdGEoZCA9PiBkLmZlYXR1cmVzLCBkID0+IGQuSUQpO1xuXHQvL1xuXHRsZXQgeEFkaiA9IGYgPT4gKGYuc3RyYW5kID09PSBcIitcIiA/IHRoaXMudGlja0xlbmd0aCA6IC10aGlzLnRpY2tMZW5ndGgpO1xuXHQvL1xuXHRsZXQgc2hhcGUgPSBcImNpcmNsZVwiOyAgLy8gXCJjaXJjbGVcIiBvciBcImxpbmVcIlxuXHQvL1xuXHRsZXQgbmV3ZnMgPSBmZWF0cy5lbnRlcigpXG5cdCAgICAuYXBwZW5kKHNoYXBlKVxuXHQgICAgLmF0dHIoXCJjbGFzc1wiLFwiZmVhdHVyZVwiKVxuXHQgICAgLm9uKCdjbGljaycsIChmKSA9PiB7XG5cdFx0bGV0IGkgPSBmLmNhbm9uaWNhbHx8Zi5JRDtcblx0ICAgICAgICB0aGlzLmFwcC5zZXRDb250ZXh0KHtsYW5kbWFyazppLCBoaWdobGlnaHQ6W2ldfSk7XG5cdCAgICB9KSA7XG5cdG5ld2ZzLmFwcGVuZChcInRpdGxlXCIpXG5cdFx0LnRleHQoZj0+Zi5zeW1ib2wgfHwgZi5pZCk7XG5cdGlmIChzaGFwZSA9PT0gXCJsaW5lXCIpIHtcblx0ICAgIGZlYXRzLmF0dHIoXCJ4MVwiLCBmID0+IHhBZGooZikgKyA1KVxuXHQgICAgZmVhdHMuYXR0cihcInkxXCIsIGYgPT4gcmcueXNjYWxlKGYuc3RhcnQpKVxuXHQgICAgZmVhdHMuYXR0cihcIngyXCIsIGYgPT4geEFkaihmKSArIHRoaXMudGlja0xlbmd0aCArIDUpXG5cdCAgICBmZWF0cy5hdHRyKFwieTJcIiwgZiA9PiByZy55c2NhbGUoZi5zdGFydCkpXG5cdH1cblx0ZWxzZSB7XG5cdCAgICBmZWF0cy5hdHRyKFwiY3hcIiwgZiA9PiB4QWRqKGYpKVxuXHQgICAgZmVhdHMuYXR0cihcImN5XCIsIGYgPT4gcmcueXNjYWxlKGYuc3RhcnQpKVxuXHQgICAgZmVhdHMuYXR0cihcInJcIiwgIHRoaXMudGlja0xlbmd0aCAvIDIpO1xuXHR9XG5cdC8vXG5cdGZlYXRzLmV4aXQoKS5yZW1vdmUoKVxuICAgIH1cbn0gLy8gZW5kIGNsYXNzIEdlbm9tZVZpZXdcblxuZXhwb3J0IHsgR2Vub21lVmlldyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvR2Vub21lVmlldy5qc1xuLy8gbW9kdWxlIGlkID0gMjJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9Db21wb25lbnQnO1xuXG5jbGFzcyBGZWF0dXJlRGV0YWlscyBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY29uc3RydWN0b3IgKGFwcCwgZWx0KSB7XG4gICAgICAgIHN1cGVyKGFwcCwgZWx0KTtcblx0dGhpcy5pbml0RG9tICgpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGluaXREb20gKCkge1xuXHQvL1xuXHR0aGlzLnJvb3Quc2VsZWN0IChcIi5idXR0b24uY2xvc2VcIilcblx0ICAgIC5vbihcImNsaWNrLmV4dHJhXCIsICgpID0+IHRoaXMudXBkYXRlKCkpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vXG4gICAgdXBkYXRlKGYpIHtcblx0Ly8gaWYgY2FsbGVkIHdpdGggbm8gYXJncywgdXBkYXRlIHVzaW5nIHRoZSBwcmV2aW91cyBmZWF0dXJlXG5cdGYgPSBmIHx8IHRoaXMubGFzdEZlYXR1cmU7XG5cdGlmICghZikge1xuXHQgICAvLyBGSVhNRTogbWFqb3IgcmVhY2hvdmVyIGluIHRoaXMgc2VjdGlvblxuXHQgICAvL1xuXHQgICAvLyBmYWxsYmFjay4gdGFrZSB0aGUgZmlyc3QgaGlnaGxpZ2h0ZWQuXG5cdCAgIGxldCByID0gdGhpcy5hcHAuem9vbVZpZXcuc3ZnTWFpbi5zZWxlY3QoXCJyZWN0LmZlYXR1cmUuaGlnaGxpZ2h0XCIpWzBdWzBdO1xuXHQgICAvLyBmYWxsYmFjay4gdGFrZSB0aGUgZmlyc3QgZmVhdHVyZVxuXHQgICBpZiAoIXIpIHIgPSB0aGlzLmFwcC56b29tVmlldy5zdmdNYWluLnNlbGVjdChcInJlY3QuZmVhdHVyZVwiKVswXVswXTtcblx0ICAgaWYgKHIpIGYgPSByLl9fZGF0YV9fO1xuXHR9XG5cdC8vIHJlbWVtYmVyXG4gICAgICAgIGlmICghZikgdGhyb3cgXCJDYW5ub3QgdXBkYXRlIGZlYXR1cmUgZGV0YWlscy4gTm8gZmVhdHVyZS5cIjtcblx0dGhpcy5sYXN0RmVhdHVyZSA9IGY7XG5cblx0Ly8gbGlzdCBvZiBmZWF0dXJlcyB0byBzaG93IGluIGRldGFpbHMgYXJlYS5cblx0Ly8gdGhlIGdpdmVuIGZlYXR1cmUgYW5kIGFsbCBlcXVpdmFsZW50cyBpbiBvdGhlciBnZW5vbWVzLlxuXHRsZXQgZmxpc3QgPSBbZl07XG5cdGlmIChmLmNhbm9uaWNhbCkge1xuXHQgICAgLy8gRklYTUU6IHJlYWNob3ZlclxuXHQgICAgZmxpc3QgPSB0aGlzLmFwcC5mZWF0dXJlTWFuYWdlci5nZXRDYWNoZWRGZWF0dXJlc0J5Q2Fub25pY2FsSWQoZi5jYW5vbmljYWwpO1xuXHR9XG5cdC8vIEdvdCB0aGUgbGlzdC4gTm93IG9yZGVyIGl0IHRoZSBzYW1lIGFzIHRoZSBkaXNwbGF5ZWQgZ2Vub21lc1xuXHQvLyBidWlsZCBpbmRleCBvZiBnZW5vbWUgbmFtZSAtPiBmZWF0dXJlIGluIGZsaXN0XG5cdGxldCBpeCA9IGZsaXN0LnJlZHVjZSgoYWNjLGYpID0+IHsgYWNjW2YuZ2Vub21lLm5hbWVdID0gZjsgcmV0dXJuIGFjYzsgfSwge30pXG5cdGxldCBnZW5vbWVPcmRlciA9IChbdGhpcy5hcHAuckdlbm9tZV0uY29uY2F0KHRoaXMuYXBwLmNHZW5vbWVzKSk7XG5cdGZsaXN0ID0gZ2Vub21lT3JkZXIubWFwKGcgPT4gaXhbZy5uYW1lXSB8fCBudWxsKTtcblx0Ly9cblx0bGV0IGNvbEhlYWRlcnMgPSBbXG5cdCAgICAvLyBjb2x1bW5zIGhlYWRlcnMgYW5kIHRoZWlyICUgd2lkdGhzXG5cdCAgICBbXCJDYW5vbmljYWwgaWRcIiAgICAgLDEwXSxcblx0ICAgIFtcIkNhbm9uaWNhbCBzeW1ib2xcIiAsMTBdLFxuXHQgICAgW1wiR2Vub21lXCIgICAgICw5XSxcblx0ICAgIFtcIklEXCIgICAgICwxN10sXG5cdCAgICBbXCJUeXBlXCIgICAgICAgLDEwLjVdLFxuXHQgICAgW1wiQmlvVHlwZVwiICAgICwxOC41XSxcblx0ICAgIFtcIkNvb3JkaW5hdGVzXCIsMThdLFxuXHQgICAgW1wiTGVuZ3RoXCIgICAgICw3XVxuXHRdO1xuXHQvLyBJbiB0aGUgY2xvc2VkIHN0YXRlLCBvbmx5IHNob3cgdGhlIGhlYWRlciBhbmQgdGhlIHJvdyBmb3IgdGhlIHBhc3NlZCBmZWF0dXJlXG5cdGlmICh0aGlzLnJvb3QuY2xhc3NlZCgnY2xvc2VkJykpXG5cdCAgICBmbGlzdCA9IGZsaXN0LmZpbHRlciggKGZmLCBpKSA9PiBmZiA9PT0gZiApO1xuXHQvLyBEcmF3IHRoZSB0YWJsZVxuXHRsZXQgdCA9IHRoaXMucm9vdC5zZWxlY3QoJ3RhYmxlJyk7XG5cdGxldCByb3dzID0gdC5zZWxlY3RBbGwoJ3RyJykuZGF0YSggW2NvbEhlYWRlcnNdLmNvbmNhdChmbGlzdCkgKTtcblx0cm93cy5lbnRlcigpLmFwcGVuZCgndHInKVxuXHQgIC5vbihcIm1vdXNlZW50ZXJcIiwgKGYsaSkgPT4gaSAhPT0gMCAmJiB0aGlzLmFwcC56b29tVmlldy5oaWdobGlnaHQoZiwgdHJ1ZSkpXG5cdCAgLm9uKFwibW91c2VsZWF2ZVwiLCAoZixpKSA9PiBpICE9PSAwICYmIHRoaXMuYXBwLnpvb21WaWV3LmhpZ2hsaWdodCgpKTtcblx0ICAgICAgXG5cdHJvd3MuZXhpdCgpLnJlbW92ZSgpO1xuXHRyb3dzLmNsYXNzZWQoXCJoaWdobGlnaHRcIiwgKGZmLCBpKSA9PiAoaSAhPT0gMCAmJiBmZiA9PT0gZikpO1xuXHQvL1xuXHQvLyBHaXZlbiBhIGZlYXR1cmUsIHJldHVybnMgYSBsaXN0IG9mIHN0cmluZ3MgZm9yIHBvcHVsYXRpbmcgYSB0YWJsZSByb3cuXG5cdC8vIElmIGk9PT0wLCB0aGVuIGYgaXMgbm90IGEgZmVhdHVyZSwgYnV0IGEgbGlzdCBjb2x1bW5zIG5hbWVzK3dpZHRocy5cblx0Ly8gXG5cdGxldCBjZWxsRGF0YSA9IGZ1bmN0aW9uIChmLCBpKSB7XG5cdCAgICBpZiAoaSA9PT0gMCkge1xuXHRcdHJldHVybiBmO1xuXHQgICAgfVxuXHQgICAgbGV0IGNlbGxEYXRhID0gWyBcIi5cIiwgXCIuXCIsIGdlbm9tZU9yZGVyW2ktMV0ubGFiZWwsIFwiLlwiLCBcIi5cIiwgXCIuXCIsIFwiLlwiLCBcIi5cIiBdO1xuXHQgICAgLy8gZiBpcyBudWxsIGlmIGl0IGRvZXNuJ3QgZXhpc3QgZm9yIGdlbm9tZSBpIFxuXHQgICAgaWYgKGYpIHtcblx0XHRsZXQgbGluayA9IFwiXCI7XG5cdFx0bGV0IGNhbm9uaWNhbCA9IGYuY2Fub25pY2FsIHx8IFwiXCI7XG5cdFx0aWYgKGNhbm9uaWNhbCkge1xuXHRcdCAgICBsZXQgdXJsID0gYGh0dHA6Ly93d3cuaW5mb3JtYXRpY3MuamF4Lm9yZy9hY2Nlc3Npb24vJHtjYW5vbmljYWx9YDtcblx0XHQgICAgbGluayA9IGA8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJHt1cmx9XCI+JHtjYW5vbmljYWx9PC9hPmA7XG5cdFx0fVxuXHRcdGNlbGxEYXRhID0gW1xuXHRcdCAgICBsaW5rIHx8IGNhbm9uaWNhbCxcblx0XHQgICAgZi5zeW1ib2wsXG5cdFx0ICAgIGYuZ2Vub21lLmxhYmVsLFxuXHRcdCAgICBmLklELFxuXHRcdCAgICBmLnR5cGUsXG5cdFx0ICAgIGYuYmlvdHlwZSxcblx0XHQgICAgYCR7Zi5jaHJ9OiR7Zi5zdGFydH0uLiR7Zi5lbmR9ICgke2Yuc3RyYW5kfSlgLFxuXHRcdCAgICBgJHtmLmVuZCAtIGYuc3RhcnQgKyAxfSBicGBcblx0XHRdO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGNlbGxEYXRhO1xuXHR9O1xuXHRsZXQgY2VsbHMgPSByb3dzLnNlbGVjdEFsbChcInRkXCIpXG5cdCAgICAuZGF0YSgoZixpKSA9PiBjZWxsRGF0YShmLGkpKTtcblx0Y2VsbHMuZW50ZXIoKS5hcHBlbmQoXCJ0ZFwiKTtcblx0Y2VsbHMuZXhpdCgpLnJlbW92ZSgpO1xuXHRjZWxscy5odG1sKChkLGksaikgPT4ge1xuXHQgICAgcmV0dXJuIGogPT09IDAgPyBkWzBdIDogZFxuXHR9KVxuXHQuc3R5bGUoXCJ3aWR0aFwiLCAoZCxpLGopID0+IGogPT09IDAgPyBgJHtkWzFdfSVgIDogbnVsbCk7XG4gICAgfVxufVxuXG5leHBvcnQgeyBGZWF0dXJlRGV0YWlscyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvRmVhdHVyZURldGFpbHMuanNcbi8vIG1vZHVsZSBpZCA9IDIzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgU1ZHVmlldyB9IGZyb20gJy4vU1ZHVmlldyc7XG5pbXBvcnQgeyBGZWF0dXJlIH0gZnJvbSAnLi9GZWF0dXJlJztcbmltcG9ydCB7IHByZXR0eVByaW50QmFzZXMsIGNsaXAsIHBhcnNlQ29vcmRzLCBmb3JtYXRDb29yZHMsIGNvb3Jkc0FmdGVyVHJhbnNmb3JtLCByZW1vdmVEdXBzIH0gZnJvbSAnLi91dGlscyc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgWm9vbVZpZXcgZXh0ZW5kcyBTVkdWaWV3IHtcbiAgICAvL1xuICAgIGNvbnN0cnVjdG9yIChhcHAsIGVsdCwgd2lkdGgsIGhlaWdodCwgaW5pdGlhbENvb3JkcywgaW5pdGlhbEhpKSB7XG4gICAgICBzdXBlcihhcHAsIGVsdCwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAvL1xuICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgLy9cbiAgICAgIHRoaXMuZHJhd0NvdW50ID0gMDtcbiAgICAgIHRoaXMuY2ZnID0gY29uZmlnLlpvb21WaWV3O1xuICAgICAgdGhpcy5kbW9kZSA9ICdjb21wYXJpc29uJzsvLyBkcmF3aW5nIG1vZGUuICdjb21wYXJpc29uJyBvciAncmVmZXJlbmNlJ1xuICAgICAgLy8gQSBmZWF0dXJlIG1heSBiZSByZW5kZXJlZCBpbiBvbmUgb2YgdHdvIHdheXM6IGFzIGEgc2ltcGxlIHJlY3QsIG9yIGFzIGEgZ3JvdXAgY29udGFpbmluZyB0aGUgXG4gICAgICAvLyByZWN0IGFuZCBvdGhlciBzdHVmZiBsaWtlIHRleHQsIGFuIGF4aXMgbGluZSwgZXRjLlxuICAgICAgdGhpcy5zaG93RmVhdHVyZURldGFpbHMgPSBmYWxzZTsgLy8gaWYgdHJ1ZSwgc2hvdyBleG9uIHN0cnVjdHVyZVxuICAgICAgdGhpcy5jbGVhckFsbCA9IGZhbHNlOyAvLyBpZiB0cnVlLCByZW1vdmUvcmVyZW5kZXIgYWxsIGV4aXN0aW5nIGZlYXR1cmVzIG9uIG5leHQgZHJhd1xuXG4gICAgICAvL1xuICAgICAgLy8gSURzIG9mIEZlYXR1cmVzIHdlJ3JlIGhpZ2hsaWdodGluZy4gTWF5IGJlIGZlYXR1cmUncyBJRCAgb3IgY2Fub25pY2FsIElEci4vXG4gICAgICAvLyBoaUZlYXRzIGlzIGFuIG9iaiB3aG9zZSBrZXlzIGFyZSB0aGUgSURzXG4gICAgICB0aGlzLmhpRmVhdHMgPSAoaW5pdGlhbEhpIHx8IFtdKS5yZWR1Y2UoIChhLHYpID0+IHsgYVt2XT12OyByZXR1cm4gYTsgfSwge30gKTtcbiAgICAgIHRoaXMuZHJhZ2dpbmcgPSBudWxsO1xuICAgICAgdGhpcy5kcmFnZ2VyID0gdGhpcy5nZXREcmFnZ2VyKCk7XG4gICAgICAvL1xuXHQvLyBDb25maWcgZm9yIG1lbnUgdW5kZXIgbWVudSBidXR0b25cblx0dGhpcy5jeHRNZW51Q2ZnID0gW3tcblx0ICAgIG5hbWU6ICdsaW5rVG9TbnBzJyxcblx0ICAgIGxhYmVsOiAnTUdJIFNOUHMnLCBcblx0ICAgIGljb246ICdvcGVuX2luX25ldycsXG5cdCAgICB0b29sdGlwOiAnVmlldyBTTlBzIGF0IE1HSSBmb3IgdGhlIGN1cnJlbnQgc3RyYWlucyBpbiB0aGUgY3VycmVudCByZWdpb24uIChTb21lIHN0cmFpbnMgbm90IGF2YWlsYWJsZS4pJyxcblx0ICAgIGhhbmRsZXI6ICgpPT4gdGhpcy5hcHAubGlua1RvTWdpU25wUmVwb3J0KClcblx0fSx7XG5cdCAgICBuYW1lOiAnbGlua1RvUXRsJyxcblx0ICAgIGxhYmVsOiAnTUdJIFFUTHMnLCBcblx0ICAgIGljb246ICAnb3Blbl9pbl9uZXcnLFxuXHQgICAgdG9vbHRpcDogJ1ZpZXcgUVRMIGF0IE1HSSB0aGF0IG92ZXJsYXAgdGhlIGN1cnJlbnQgcmVnaW9uLicsXG5cdCAgICBoYW5kbGVyOiAoKT0+IHRoaXMuYXBwLmxpbmtUb01naVFUTHMoKVxuXHR9LHtcblx0ICAgIG5hbWU6ICdsaW5rVG9KYnJvd3NlJyxcblx0ICAgIGxhYmVsOiAnTUdJIEpCcm93c2UnLCBcblx0ICAgIGljb246ICdvcGVuX2luX25ldycsXG5cdCAgICB0b29sdGlwOiAnT3BlbiBNR0kgSkJyb3dzZSAoQzU3QkwvNkogR1JDbTM4KSB3aXRoIHRoZSBjdXJyZW50IGNvb3JkaW5hdGUgcmFuZ2UuJyxcblx0ICAgIGhhbmRsZXI6ICgpPT4gdGhpcy5hcHAubGlua1RvTWdpSkJyb3dzZSgpXG5cdH0se1xuXHQgICAgbmFtZTogJ2NsZWFyQ2FjaGUnLFxuXHQgICAgbGFiZWw6ICdDbGVhciBjYWNoZScsIFxuXHQgICAgaWNvbjogJ2RlbGV0ZV9zd2VlcCcsXG5cdCAgICB0b29sdGlwOiAnRGVsZXRlIGNhY2hlZCBmZWF0dXJlcy4gRGF0YSB3aWxsIGJlIHJlbG9hZGVkIGZyb20gdGhlIHNlcnZlciBvbiBuZXh0IHVzZS4nLFxuXHQgICAgaGFuZGxlcjogKCk9PiB0aGlzLmFwcC5jbGVhckNhY2hlZERhdGEodHJ1ZSlcblx0fV07XG5cblx0Ly8gY29uZmlnIGZvciBhIGZlYXR1cmUncyBjb250ZXh0IG1lbnVcblx0dGhpcy5mY3h0TWVudUNmZyA9IFt7XG5cdCAgICBuYW1lOiAnbWVudVRpdGxlJyxcblx0ICAgIGxhYmVsOiAoZCkgPT4gYCR7ZC5zeW1ib2wgfHwgZC5JRH1gLCBcblx0ICAgIGNsczogJ21lbnVUaXRsZSdcblx0fSx7XG5cdCAgICBuYW1lOiAnbGluZVVwT25GZWF0dXJlJyxcblx0ICAgIGxhYmVsOiAnQWxpZ24gb24gdGhpcyBmZWF0dXJlLicsXG5cdCAgICBpY29uOiAnZm9ybWF0X2FsaWduX2NlbnRlcicsXG5cdCAgICB0b29sdGlwOiAnQWxpZ25zIHRoZSBkaXNwbGF5ZWQgZ2Vub21lcyBhcm91bmQgdGhpcyBmZWF0dXJlLicsXG5cdCAgICBoYW5kbGVyOiAoZikgPT4ge1xuXHRcdGxldCBpZHMgPSAobmV3IFNldChPYmplY3Qua2V5cyh0aGlzLmhpRmVhdHMpKSkuYWRkKGYuaWQpO1xuXHQgICAgICAgIHRoaXMuYXBwLnNldENvbnRleHQoe2xhbmRtYXJrOmYuaWQsIGRlbHRhOjAsIGhpZ2hsaWdodDpBcnJheS5mcm9tKGlkcyl9KVxuXHQgICAgfVxuXHR9LHtcblx0ICAgIG5hbWU6ICd0b01HSScsXG5cdCAgICBsYWJlbDogJ0ZlYXR1cmVATUdJJywgXG5cdCAgICBpY29uOiAnb3Blbl9pbl9uZXcnLFxuXHQgICAgdG9vbHRpcDogJ1NlZSBkZXRhaWxzIGZvciB0aGlzIGZlYXR1cmUgYXQgTUdJLicsXG5cdCAgICBoYW5kbGVyOiAoZikgPT4geyB3aW5kb3cub3BlbihgaHR0cDovL3d3dy5pbmZvcm1hdGljcy5qYXgub3JnL2FjY2Vzc2lvbi8ke2YuaWR9YCwgJ19ibGFuaycpIH1cblx0fSx7XG5cdCAgICBuYW1lOiAndG9Nb3VzZU1pbmUnLFxuXHQgICAgbGFiZWw6ICdGZWF0dXJlQE1vdXNlTWluZScsIFxuXHQgICAgaWNvbjogJ29wZW5faW5fbmV3Jyxcblx0ICAgIHRvb2x0aXA6ICdTZWUgZGV0YWlscyBmb3IgdGhpcyBmZWF0dXJlIGF0IE1vdXNlTWluZS4nLFxuXHQgICAgaGFuZGxlcjogKGYpID0+IHRoaXMuYXBwLmxpbmtUb1JlcG9ydFBhZ2UoZilcblx0fSx7XG5cdCAgICBuYW1lOiAnZ2Vub21pY1NlcURvd25sb2FkJyxcblx0ICAgIGxhYmVsOiAnR2Vub21pYyBzZXF1ZW5jZXMnLCBcblx0ICAgIGljb246ICdjbG91ZF9kb3dubG9hZCcsXG5cdCAgICB0b29sdGlwOiAnRG93bmxvYWQgZ2Vub21pYyBzZXF1ZW5jZXMgZm9yIHRoaXMgZmVhdHVyZSBmcm9tIGN1cnJlbnRseSBkaXNwbGF5ZWQgZ2Vub21lcy4nLFxuXHQgICAgaGFuZGxlcjogKGYpID0+IHsgXG5cdFx0dGhpcy5hcHAuZG93bmxvYWRGYXN0YShmLCAnZ2Vub21pYycsIHRoaXMuYXBwLnZHZW5vbWVzLm1hcCh2Zz0+dmcubGFiZWwpKTtcblx0ICAgIH1cbiAgICAgICAgfSx7XG5cdCAgICBuYW1lOiAndHhwU2VxRG93bmxvYWQnLFxuXHQgICAgbGFiZWw6ICdUcmFuc2NyaXB0IHNlcXVlbmNlcycsIFxuXHQgICAgaWNvbjogJ2Nsb3VkX2Rvd25sb2FkJyxcblx0ICAgIHRvb2x0aXA6ICdEb3dubG9hZCB0cmFuc2NyaXB0IHNlcXVlbmNlcyBvZiB0aGlzIGZlYXR1cmUgZnJvbSBjdXJyZW50bHkgZGlzcGxheWVkIGdlbm9tZXMuJyxcblx0ICAgIGhhbmRsZXI6IChmKSA9PiB7IFxuXHRcdHRoaXMuYXBwLmRvd25sb2FkRmFzdGEoZiwgJ3RyYW5zY3JpcHQnLCB0aGlzLmFwcC52R2Vub21lcy5tYXAodmc9PnZnLmxhYmVsKSk7XG5cdCAgICB9XG5cdH0se1xuXHQgICAgbmFtZTogJ3R4cFNlcURvd25sb2FkJyxcblx0ICAgIGxhYmVsOiAnVHJhbnNjcmlwdCBzZXF1ZW5jZXMnLCBcblx0ICAgIGljb246ICdjbG91ZF9kb3dubG9hZCcsXG5cdCAgICB0b29sdGlwOiAnRG93bmxvYWQgdHJhbnNjcmlwdCBzZXF1ZW5jZXMgb2YgdGhpcyBmZWF0dXJlIGZyb20gY3VycmVudGx5IGRpc3BsYXllZCBnZW5vbWVzLicsXG5cdCAgICBoYW5kbGVyOiAoZikgPT4geyBcblx0XHR0aGlzLmFwcC5kb3dubG9hZEZhc3RhKGYsICd0cmFuc2NyaXB0JywgdGhpcy5hcHAudkdlbm9tZXMubWFwKHZnPT52Zy5sYWJlbCkpO1xuXHQgICAgfVxuXHR9LHtcblx0ICAgIG5hbWU6ICdjZHNTZXFEb3dubG9hZCcsXG5cdCAgICBsYWJlbDogJ0NEUyBzZXF1ZW5jZXMnLCBcblx0ICAgIGljb246ICdjbG91ZF9kb3dubG9hZCcsXG5cdCAgICB0b29sdGlwOiAnRG93bmxvYWQgY29kaW5nIHNlcXVlbmNlcyBvZiB0aGlzIGZlYXR1cmUgZnJvbSBjdXJyZW50bHkgZGlzcGxheWVkIGdlbm9tZXMuJyxcblx0ICAgIGRpc2FibGVyOiAoZikgPT4gZi5iaW90eXBlLmluZGV4T2YoJ3Byb3RlaW4nKSA9PT0gLTEsIC8vIGRpc2FibGUgaWYgZiBpcyBub3QgcHJvdGVpbiBjb2Rpbmdcblx0ICAgIGhhbmRsZXI6IChmKSA9PiB7IFxuXHRcdHRoaXMuYXBwLmRvd25sb2FkRmFzdGEoZiwgJ2NkcycsIHRoaXMuYXBwLnZHZW5vbWVzLm1hcCh2Zz0+dmcubGFiZWwpKTtcblx0ICAgIH1cblx0fSx7XG5cdCAgICBuYW1lOiAnZXhvblNlcURvd25sb2FkJyxcblx0ICAgIGxhYmVsOiAnRXhvbiBzZXF1ZW5jZXMnLCBcblx0ICAgIGljb246ICdjbG91ZF9kb3dubG9hZCcsXG5cdCAgICB0b29sdGlwOiAnRG93bmxvYWQgZXhvbiBzZXF1ZW5jZXMgb2YgdGhpcyBmZWF0dXJlIGZyb20gY3VycmVudGx5IGRpc3BsYXllZCBnZW5vbWVzLicsXG5cdCAgICBkaXNhYmxlcjogKGYpID0+IGYudHlwZS5pbmRleE9mKCdnZW5lJykgPT09IC0xLFxuXHQgICAgaGFuZGxlcjogKGYpID0+IHsgXG5cdFx0dGhpcy5hcHAuZG93bmxvYWRGYXN0YShmLCAnZXhvbicsIHRoaXMuYXBwLnZHZW5vbWVzLm1hcCh2Zz0+dmcubGFiZWwpKTtcblx0ICAgIH1cblx0fV07XG4gICAgICAvL1xuICAgICAgdGhpcy5pbml0RG9tKCk7XG4gICAgfVxuICAgIC8vXG4gICAgaW5pdERvbSAoKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcblx0bGV0IHIgPSB0aGlzLnJvb3Q7XG5cdGxldCBhID0gdGhpcy5hcHA7XG4gICAgICAgIC8vXG4gICAgICAgIHRoaXMuZmlkdWNpYWxzID0gdGhpcy5zdmcuaW5zZXJ0KCdnJywnOmZpcnN0LWNoaWxkJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCdmaWR1Y2lhbHMnKTtcbiAgICAgICAgdGhpcy5zdHJpcHNHcnAgPSB0aGlzLnN2Z01haW4uYXBwZW5kKCdnJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCdzdHJpcHMnKTtcbiAgICAgICAgdGhpcy5heGlzID0gdGhpcy5zdmdNYWluLmFwcGVuZCgnZycpXG4gICAgICAgICAgLmF0dHIoJ2NsYXNzJywnYXhpcycpO1xuXHQvLyBcbiAgICAgICAgdGhpcy5mbG9hdGluZ1RleHQgPSB0aGlzLnN2Z01haW4uYXBwZW5kKCdnJylcbiAgICAgICAgICAuYXR0cignY2xhc3MnLCdmbG9hdGluZ1RleHQnKTtcblx0dGhpcy5mbG9hdGluZ1RleHQuYXBwZW5kKCdyZWN0Jyk7XG5cdHRoaXMuZmxvYXRpbmdUZXh0LmFwcGVuZCgndGV4dCcpO1xuXHQvL1xuICAgICAgICB0aGlzLmN4dE1lbnUgPSB0aGlzLnJvb3Quc2VsZWN0KCdbbmFtZT1cImN4dE1lbnVcIl0nKTtcblx0Ly9cblx0ci5zZWxlY3QoJy5idXR0b24uY2xvc2UnKVxuXHQgICAgLm9uKCdjbGljaycsICgpID0+IHRoaXMudXBkYXRlKCkpO1xuXG5cdC8vIHpvb20gY29udHJvbHNcblx0ci5zZWxlY3QoJyN6b29tT3V0Jykub24oJ2NsaWNrJyxcblx0ICAgICgpID0+IHsgYS56b29tKGEuZGVmYXVsdFpvb20pIH0pO1xuXHRyLnNlbGVjdCgnI3pvb21JbicpIC5vbignY2xpY2snLFxuXHQgICAgKCkgPT4geyBhLnpvb20oMS9hLmRlZmF1bHRab29tKSB9KTtcblx0ci5zZWxlY3QoJyN6b29tT3V0TW9yZScpLm9uKCdjbGljaycsXG5cdCAgICAoKSA9PiB7IGEuem9vbSgyKmEuZGVmYXVsdFpvb20pIH0pO1xuXHRyLnNlbGVjdCgnI3pvb21Jbk1vcmUnKSAub24oJ2NsaWNrJyxcblx0ICAgICgpID0+IHsgYS56b29tKDEvKDIqYS5kZWZhdWx0Wm9vbSkpIH0pO1xuXG5cdC8vIHBhbiBjb250cm9sc1xuXHRyLnNlbGVjdCgnI3BhbkxlZnQnKSAub24oJ2NsaWNrJyxcblx0ICAgICgpID0+IHsgYS5wYW4oLWEuZGVmYXVsdFBhbikgfSk7XG5cdHIuc2VsZWN0KCcjcGFuUmlnaHQnKS5vbignY2xpY2snLFxuXHQgICAgKCkgPT4geyBhLnBhbigrYS5kZWZhdWx0UGFuKSB9KTtcblx0ci5zZWxlY3QoJyNwYW5MZWZ0TW9yZScpIC5vbignY2xpY2snLFxuXHQgICAgKCkgPT4geyBhLnBhbigtNSphLmRlZmF1bHRQYW4pIH0pO1xuXHRyLnNlbGVjdCgnI3BhblJpZ2h0TW9yZScpLm9uKCdjbGljaycsXG5cdCAgICAoKSA9PiB7IGEucGFuKCs1KmEuZGVmYXVsdFBhbikgfSk7XG5cblx0Ly9cblx0dGhpcy5yb290XG5cdCAgLm9uKCdjbGljaycsICgpID0+IHtcblx0ICAgICAgLy8gY2xpY2sgb24gYmFja2dyb3VuZCA9PiBoaWRlIGNvbnRleHQgbWVudVxuXHQgICAgICBsZXQgdGd0ID0gZDMuZXZlbnQudGFyZ2V0O1xuXHQgICAgICBpZiAodGd0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2knICYmIHRndC5pbm5lckhUTUwgPT09ICdtZW51Jylcblx0XHQgIC8vIGV4Y2VwdGlvbjogdGhlIGNvbnRleHQgbWVudSBidXR0b24gaXRzZWxmXG5cdCAgICAgICAgICByZXR1cm47XG5cdCAgICAgIGVsc2Vcblx0XHQgIHRoaXMuaGlkZUNvbnRleHRNZW51KClcblx0ICB9KTtcblxuXHQvLyBGZWF0dXJlIG1vdXNlIGV2ZW50IGhhbmRsZXJzLlxuXHQvL1xuXHRsZXQgZkNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uIChmLCBldnQsIHByZXNlcnZlKSB7XG5cdCAgICBsZXQgaWQgPSBmLmlkO1xuXHQgICAgaWYgKGV2dC5jdHJsS2V5KSB7XG5cdCAgICAgICAgbGV0IGN4ID0gZDMuZXZlbnQuY2xpZW50WDtcblx0ICAgICAgICBsZXQgY3kgPSBkMy5ldmVudC5jbGllbnRZO1xuXHQgICAgICAgIGxldCBiYiA9IHRoaXMucm9vdC5zZWxlY3QoJ1tuYW1lPVwiem9vbWNvbnRyb2xzXCJdID4gLm1lbnUgPiAuYnV0dG9uJykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblx0XHR0aGlzLnNob3dDb250ZXh0TWVudSh0aGlzLmZjeHRNZW51Q2ZnLCBmLCBjeC1iYi54LCBjeS1iYi55KTtcblx0ICAgIH1cblx0ICAgIGVsc2UgaWYgKGV2dC5zaGlmdEtleSkge1xuXHRcdGlmICh0aGlzLmhpRmVhdHNbaWRdKVxuXHRcdCAgICBkZWxldGUgdGhpcy5oaUZlYXRzW2lkXVxuXHRcdGVsc2Vcblx0XHQgICAgdGhpcy5oaUZlYXRzW2lkXSA9IGlkO1xuXHQgICAgfVxuXHQgICAgZWxzZSB7XG5cdFx0aWYgKCFwcmVzZXJ2ZSkgdGhpcy5oaUZlYXRzID0ge307XG5cdFx0dGhpcy5oaUZlYXRzW2lkXSA9IGlkO1xuXHQgICAgfVxuXHQgICAgLy8gRklYTUU6IHJlYWNob3ZlclxuXHQgICAgdGhpcy5hcHAuZmVhdHVyZURldGFpbHMudXBkYXRlKGYpO1xuXHR9LmJpbmQodGhpcyk7XG5cdC8vXG5cdGxldCBmTW91c2VPdmVySGFuZGxlciA9IGZ1bmN0aW9uKGYpIHtcblx0XHRpZiAoZDMuZXZlbnQuYWx0S2V5KSB7XG5cdFx0ICAgIC8vIElmIHVzZXIgaXMgaG9sZGluZyB0aGUgYWx0IGtleSwgc2VsZWN0IGV2ZXJ5dGhpbmcgdG91Y2hlZC5cblx0XHQgICAgZkNsaWNrSGFuZGxlcihmLCBkMy5ldmVudCwgdHJ1ZSk7XG5cdFx0ICAgIHRoaXMuaGlnaGxpZ2h0KCk7XG5cdFx0ICAgIC8vIERvbid0IHJlZ2lzdGVyIGNvbnRleHQgY2hhbmdlcyB1bnRpbCB1c2VyIGhhcyBwYXVzZWQgZm9yIGF0IGxlYXN0IDFzLlxuXHRcdCAgICBpZiAodGhpcy50aW1lb3V0KSB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG5cdFx0ICAgIHRoaXMudGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IHRoaXMuYXBwLmNvbnRleHRDaGFuZ2VkKCk7IH0uYmluZCh0aGlzKSwgMTAwMCk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdCAgICB0aGlzLmhpZ2hsaWdodChmKTtcblx0XHQgICAgaWYgKGQzLmV2ZW50LmN0cmxLZXkpXG5cdFx0ICAgICAgICB0aGlzLmFwcC5mZWF0dXJlRGV0YWlscy51cGRhdGUoZik7XG5cdFx0fVxuXHR9LmJpbmQodGhpcyk7XG5cdC8vXG5cdGxldCBmTW91c2VPdXRIYW5kbGVyID0gZnVuY3Rpb24oZikge1xuXHRcdHRoaXMuaGlnaGxpZ2h0KCk7IFxuXHR9LmJpbmQodGhpcyk7XG5cblx0Ly8gSGFuZGxlIGtleSBldmVudHNcblx0ZDMuc2VsZWN0KHdpbmRvdykub24oJ2tleXByZXNzJywgKCkgPT4ge1xuXHQgICAgbGV0IGUgPSBkMy5ldmVudDtcblx0ICAgIGlmIChlLmtleSA9PT0gJ3gnIHx8IGUuY29kZSA9PT0gJ0tleVgnKXtcblx0ICAgICAgICB0aGlzLnNwcmVhZFRyYW5zY3JpcHRzID0gISB0aGlzLnNwcmVhZFRyYW5zY3JpcHRzO1xuXHQgICAgfVxuXHQgICAgZWxzZSBpZiAoZS5rZXkgPT09ICcrJyB8fCBlLmNvZGUgPT09ICdFcXVhbCcgJiYgZS5zaGlmdEtleSkge1xuXHQgICAgICAgIHRoaXMuZmVhdEhlaWdodCA9IHRoaXMuZmVhdEhlaWdodCAqIDEuNjc7XG5cdCAgICB9XG5cdCAgICBlbHNlIGlmIChlLmtleSA9PT0gJy0nIHx8IGUuY29kZSA9PT0gJ01pbnVzJykge1xuXHQgICAgICAgIHRoaXMuZmVhdEhlaWdodCA9IHRoaXMuZmVhdEhlaWdodCAvIDEuNjc7XG5cdCAgICB9XG5cdH0pXG5cblx0Ly8gXG4gICAgICAgIHRoaXMuc3ZnXG5cdCAgLm9uKCdkYmxjbGljaycsICgpID0+IHtcblx0ICAgICAgbGV0IHQgPSBkMy5ldmVudC50YXJnZXQ7XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5zZWxlY3QodCk7XG5cdCAgICAgIGxldCBmZWx0ID0gdC5jbG9zZXN0KCcuZmVhdHVyZScpO1xuXHQgICAgICBpZiAoZmVsdCkge1xuXHRcdCAgLy8gdXNlciBkb3VibGUgY2xpY2tlZCBvbiBhIGZlYXR1cmVcblx0XHQgIC8vIG1ha2UgaXQgdGhlIGxhbmRtYXJrXG5cdFx0ICBsZXQgZiA9IGZlbHQuX19kYXRhX187XG5cdFx0ICB0aGlzLmFwcC5zZXRDb250ZXh0KHtsYW5kbWFyazpmLmlkLCByZWY6Zi5nZW5vbWUubmFtZSwgZGVsdGE6IDB9KTtcblx0ICAgICAgfVxuXHQgIH0pXG5cdCAgLm9uKCdjbGljaycsICgpID0+IHtcblx0ICAgICAgbGV0IHQgPSBkMy5ldmVudC50YXJnZXQ7XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5zZWxlY3QodCk7XG5cdCAgICAgIGlmICh0aGlzLmRlYWxXaXRoVW53YW50ZWRDbGlja0V2ZW50KSB7XG5cdCAgICAgICAgICB0aGlzLmRlYWxXaXRoVW53YW50ZWRDbGlja0V2ZW50ID0gZmFsc2U7XG5cdFx0ICByZXR1cm47XG5cdCAgICAgIH1cblx0ICAgICAgbGV0IGZlbHQgPSB0LmNsb3Nlc3QoJy5mZWF0dXJlJyk7XG5cdCAgICAgIGlmIChmZWx0KSB7XG5cdFx0ICAvLyB1c2VyIGNsaWNrZWQgb24gYSBmZWF0dXJlXG5cdFx0ICBmQ2xpY2tIYW5kbGVyKGZlbHQuX19kYXRhX18sIGQzLmV2ZW50KTtcblx0XHQgIHRoaXMuaGlnaGxpZ2h0KCk7XG5cdCAgICAgICAgICB0aGlzLmFwcC5jb250ZXh0Q2hhbmdlZCgpO1xuXHQgICAgICB9XG5cdCAgICAgIGVsc2UgaWYgKCFkMy5ldmVudC5zaGlmdEtleSAmJiBcblx0ICAgICAgICAgICh0LnRhZ05hbWUgPT09ICdzdmcnIFxuXHRcdCAgfHwgdC50YWdOYW1lID09ICdyZWN0JyAmJiB0LmNsYXNzTGlzdC5jb250YWlucygnYmxvY2snKVxuXHRcdCAgfHwgdC50YWdOYW1lID09ICdyZWN0JyAmJiB0LmNsYXNzTGlzdC5jb250YWlucygndW5kZXJsYXknKVxuXHRcdCAgKSl7XG5cdFx0ICAvLyB1c2VyIGNsaWNrZWQgb24gYmFja2dyb3VuZFxuXHRcdCAgdGhpcy5oaUZlYXRzID0ge307XG5cdFx0ICB0aGlzLmhpZ2hsaWdodCgpO1xuXHRcdCAgdGhpcy5hcHAuY29udGV4dENoYW5nZWQoKTtcblx0ICAgICAgfVxuXHQgIH0pXG5cdCAgLm9uKCdjb250ZXh0bWVudScsICgpID0+IHtcblx0ICAgICAgbGV0IHRndCA9IGQzLnNlbGVjdChkMy5ldmVudC50YXJnZXQpO1xuXHQgICAgICBsZXQgZiA9IHRndC5kYXRhKClbMF07XG5cdCAgICAgIGYgPSBmID8gZi5mZWF0dXJlIHx8IGYgOiBmO1xuXHQgICAgICBpZiAoZiBpbnN0YW5jZW9mIEZlYXR1cmUpIHtcblx0XHQgIGZDbGlja0hhbmRsZXIoZiwgZDMuZXZlbnQpO1xuXHQgICAgICB9XG5cdCAgICAgIGQzLmV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgICBkMy5ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHQgIH0pXG5cdCAgLm9uKCdtb3VzZW92ZXInLCAoKSA9PiB7XG5cdCAgICAgIGxldCB0Z3QgPSBkMy5zZWxlY3QoZDMuZXZlbnQudGFyZ2V0KTtcblx0ICAgICAgbGV0IGYgPSB0Z3QuZGF0YSgpWzBdO1xuXHQgICAgICBmID0gZiA/IGYuZmVhdHVyZSB8fCBmIDogZjtcblx0ICAgICAgaWYgKGYgaW5zdGFuY2VvZiBGZWF0dXJlKSB7XG5cdFx0ICBmTW91c2VPdmVySGFuZGxlcihmKTtcblx0ICAgICAgfVxuXHQgIH0pXG5cdCAgLm9uKCdtb3VzZW91dCcsICgpID0+IHtcblx0ICAgICAgbGV0IHRndCA9IGQzLnNlbGVjdChkMy5ldmVudC50YXJnZXQpO1xuXHQgICAgICBsZXQgZiA9IHRndC5kYXRhKClbMF07XG5cdCAgICAgIGYgPSBmID8gZi5mZWF0dXJlIHx8IGYgOiBmO1xuXHQgICAgICBpZiAoZiBpbnN0YW5jZW9mIEZlYXR1cmUpIHtcblx0XHQgIGZNb3VzZU91dEhhbmRsZXIoZik7XG5cdCAgICAgIH1cblx0ICB9KVxuXHQgIC5vbignd2hlZWwnLCBmdW5jdGlvbihkKSB7XG5cdCAgICBsZXQgZSA9IGQzLmV2ZW50O1xuXHQgICAgLy8gbGV0IHRoZSBicm93c2VyIGhhbmRsZXIgdmVydGljYWwgbW90aW9uXG5cdCAgICBpZiAoTWF0aC5hYnMoZS5kZWx0YVgpIDwgTWF0aC5hYnMoZS5kZWx0YVkpKVxuXHQgICAgICAgIHJldHVybjtcblx0ICAgIC8vIHdlIGhhbmRsZSBob3Jpem9udGFsIG1vdGlvbi5cblx0ICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cdCAgICAvLyBmaWx0ZXIgb3V0IHRpbnkgbW90aW9uc1xuXHQgICAgaWYgKE1hdGguYWJzKGUuZGVsdGFYKSA8IHNlbGYuY2ZnLndoZWVsVGhyZXNob2xkKSBcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAvLyBnZXQgdGhlIHpvb20gc3RyaXAgdGFyZ2V0LCBpZiBpdCBleGlzdHMsIGVsc2UgdGhlIHJlZiB6b29tIHN0cmlwLlxuXHQgICAgbGV0IHogPSBlLnRhcmdldC5jbG9zZXN0KCdnLnpvb21TdHJpcCcpIHx8IGQzLnNlbGVjdCgnZy56b29tU3RyaXAucmVmZXJlbmNlJylbMF1bMF07XG5cdCAgICBpZiAoIXopIHJldHVybjtcblxuXHQgICAgbGV0IGRiID0gZS5kZWx0YVggLyBzZWxmLnBwYjsgLy8gZGVsdGEgaW4gYmFzZXMgZm9yIHRoaXMgZXZlbnRcblx0ICAgIGxldCB6ZCA9IHouX19kYXRhX187XG5cdCAgICBpZiAoZS5jdHJsS2V5KSB7XG5cdFx0Ly8gQ3RybC13aGVlbCBzaW1wbHkgc2xpZGVzIHRoZSBzdHJpcCBob3Jpem9udGFsbHkgKHRlbXBvcmFyeSlcblx0XHQvLyBGb3IgY29tcGFyaXNvbiBnZW5vbWVzLCBqdXN0IHRyYW5zbGF0ZSB0aGUgYmxvY2tzIGJ5IHRoZSB3aGVlbCBhbW91bnQsIHNvIHRoZSB1c2VyIGNhbiBcblx0XHQvLyBzZWUgZXZlcnl0aGluZy5cblx0XHR6ZC5kZWx0YUIgKz0gZGI7XG5cdCAgICAgICAgZDMuc2VsZWN0KHopLnNlbGVjdCgnZ1tuYW1lPVwic0Jsb2Nrc1wiXScpLmF0dHIoJ3RyYW5zZm9ybScsYHRyYW5zbGF0ZSgkey16ZC5kZWx0YUIgKiBzZWxmLnBwYn0sMClzY2FsZSgke3pkLnhTY2FsZX0sMSlgKTtcblx0XHRzZWxmLmRyYXdGaWR1Y2lhbHMoKTtcblx0XHRyZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIC8vIE5vcm1hbCB3aGVlbCBldmVudCA9IHBhbiB0aGUgdmlldy5cblx0ICAgIC8vXG5cdCAgICBsZXQgYyAgPSBzZWxmLmFwcC5jb29yZHM7XG5cdCAgICAvLyBMaW1pdCBkZWx0YSBieSBjaHIgZW5kc1xuXHQgICAgLy8gRGVsdGEgaW4gYmFzZXM6XG5cdCAgICB6ZC5kZWx0YUIgPSBjbGlwKHpkLmRlbHRhQiArIGRiLCAtYy5zdGFydCwgYy5jaHJvbW9zb21lLmxlbmd0aCAtIGMuZW5kKVxuXHQgICAgLy8gdHJhbnNsYXRlXG5cdCAgICBkMy5zZWxlY3QodGhpcykuc2VsZWN0QWxsKCdnLnpvb21TdHJpcCA+IGdbbmFtZT1cInNCbG9ja3NcIl0nKVxuXHRcdC5hdHRyKCd0cmFuc2Zvcm0nLCBjeiA9PiBgdHJhbnNsYXRlKCR7LXpkLmRlbHRhQiAqIHNlbGYucHBifSwwKXNjYWxlKCR7Y3oueFNjYWxlfSwxKWApO1xuXHQgICAgc2VsZi5kcmF3RmlkdWNpYWxzKCk7XG5cdCAgICAvLyBXYWl0IHVudGlsIHdoZWVsIGV2ZW50cyBoYXZlIHN0b3BwZWQgZm9yIGEgd2hpbGUsIHRoZW4gc2Nyb2xsIHRoZSB2aWV3LlxuXHQgICAgaWYgKHNlbGYudGltZW91dCl7XG5cdCAgICAgICAgd2luZG93LmNsZWFyVGltZW91dChzZWxmLnRpbWVvdXQpO1xuXHQgICAgfVxuXHQgICAgc2VsZi50aW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdHNlbGYudGltZW91dCA9IG51bGw7XG5cdFx0bGV0IGNjeHQgPSBzZWxmLmFwcC5nZXRDb250ZXh0KCk7XG5cdFx0bGV0IG5jeHQ7XG5cdFx0aWYgKGNjeHQubGFuZG1hcmspIHtcblx0XHQgICAgbmN4dCA9IHsgZGVsdGE6IGNjeHQuZGVsdGEgKyB6ZC5kZWx0YUIgfTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0ICAgIG5jeHQgPSB7IHN0YXJ0OiBjY3h0LnN0YXJ0ICsgemQuZGVsdGFCLCBlbmQ6IGNjeHQuZW5kICsgemQuZGVsdGFCIH07XG5cdFx0fVxuXHRcdHNlbGYuYXBwLnNldENvbnRleHQobmN4dCk7XG5cdFx0emQuZGVsdGFCID0gMDtcblx0ICAgIH0sIHNlbGYuY2ZnLndoZWVsQ29udGV4dERlbGF5KTtcblx0fSk7XG5cblx0Ly8gQnV0dG9uOiBEcm9wIGRvd24gbWVudSBpbiB6b29tIHZpZXdcblx0dGhpcy5yb290LnNlbGVjdCgnLm1lbnUgPiAuYnV0dG9uJylcblx0ICAub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXHQgICAgICAvLyBzaG93IGNvbnRleHQgbWVudSBhdCBtb3VzZSBldmVudCBjb29yZGluYXRlc1xuXHQgICAgICBsZXQgY3ggPSBkMy5ldmVudC5jbGllbnRYO1xuXHQgICAgICBsZXQgY3kgPSBkMy5ldmVudC5jbGllbnRZO1xuXHQgICAgICBsZXQgYmIgPSBkMy5zZWxlY3QodGhpcylbMF1bMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgICAgIGQzLmV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHQgICAgICBzZWxmLnNob3dDb250ZXh0TWVudShzZWxmLmN4dE1lbnVDZmcsIG51bGwsIGN4LWJiLmxlZnQsIGN5LWJiLnRvcCk7XG5cdCAgfSk7XG5cdC8vIHpvb20gY29vcmRpbmF0ZXMgYm94XG5cdHRoaXMucm9vdC5zZWxlY3QoJyN6b29tQ29vcmRzJylcblx0ICAgIC5jYWxsKHpjcyA9PiB6Y3NbMF1bMF0udmFsdWUgPSBmb3JtYXRDb29yZHModGhpcy5hcHAuY29vcmRzKSlcblx0ICAgIC5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7IHRoaXMuc2VsZWN0KCk7IH0pXG5cdCAgICAub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHsgc2VsZi5hcHAuc2V0Q29vcmRpbmF0ZXModGhpcy52YWx1ZSk7IH0pO1xuXG5cdC8vIHpvb20gd2luZG93IHNpemUgYm94XG5cdHRoaXMucm9vdC5zZWxlY3QoJyN6b29tV1NpemUnKVxuXHQgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHsgdGhpcy5zZWxlY3QoKTsgfSlcblx0ICAgIC5vbignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgbGV0IHdzID0gcGFyc2VJbnQodGhpcy52YWx1ZSk7XG5cdFx0bGV0IGMgPSBzZWxmLmFwcC5jb29yZHM7XG5cdFx0aWYgKGlzTmFOKHdzKSB8fCB3cyA8IDEwMCkge1xuXHRcdCAgICBhbGVydCgnSW52YWxpZCB3aW5kb3cgc2l6ZS4gUGxlYXNlIGVudGVyIGFuIGludGVnZXIgPj0gMTAwLicpO1xuXHRcdCAgICB0aGlzLnZhbHVlID0gTWF0aC5yb3VuZChjLmVuZCAtIGMuc3RhcnQgKyAxKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0ICAgIGxldCBtaWQgPSAoYy5zdGFydCArIGMuZW5kKSAvIDI7XG5cdFx0ICAgIGxldCBuZXdzID0gTWF0aC5yb3VuZChtaWQgLSB3cy8yKTtcblx0XHQgICAgbGV0IG5ld2UgPSBuZXdzICsgd3MgLSAxO1xuXHRcdCAgICBzZWxmLmFwcC5zZXRDb250ZXh0KHtcblx0XHQgICAgICAgIGNocjogYy5jaHIsXG5cdFx0XHRzdGFydDogbmV3cyxcblx0XHRcdGVuZDogbmV3ZSxcblx0XHRcdGxlbmd0aDogbmV3ZS1uZXdzKzFcblx0XHQgICAgfSk7XG5cdFx0fVxuXHQgICAgfSk7XG5cdC8vIHpvb20gZHJhd2luZyBtb2RlIFxuXHR0aGlzLnJvb3Quc2VsZWN0QWxsKCdkaXZbbmFtZT1cInpvb21EbW9kZVwiXSAuYnV0dG9uJylcblx0ICAgIC5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRpZiAoZDMuc2VsZWN0KHRoaXMpLmF0dHIoJ2Rpc2FibGVkJykpXG5cdFx0ICAgIHJldHVybjtcblx0XHRsZXQgciA9IHNlbGYucm9vdDtcblx0XHRsZXQgaXNDID0gci5jbGFzc2VkKCdjb21wYXJpc29uJyk7XG5cdFx0ci5jbGFzc2VkKCdjb21wYXJpc29uJywgIWlzQyk7XG5cdFx0ci5jbGFzc2VkKCdyZWZlcmVuY2UnLCBpc0MpO1xuXHRcdHNlbGYuYXBwLnNldENvbnRleHQoe2Rtb2RlOiByLmNsYXNzZWQoJ2NvbXBhcmlzb24nKSA/ICdjb21wYXJpc29uJyA6ICdyZWZlcmVuY2UnfSk7XG5cdCAgICB9KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc2V0IGhpZ2hsaWdodGVkIChobHMpIHtcblx0aWYgKHR5cGVvZihobHMpID09PSAnc3RyaW5nJylcblx0ICAgIGhscyA9IFtobHNdO1xuXHQvL1xuXHR0aGlzLmhpRmVhdHMgPSB7fTtcbiAgICAgICAgZm9yKGxldCBoIG9mIGhscyl7XG5cdCAgICB0aGlzLmhpRmVhdHNbaF0gPSBoO1xuXHR9XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldCBmZWF0SGVpZ2h0ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2ZnLmZlYXRIZWlnaHQ7XG4gICAgfVxuICAgIHNldCBmZWF0SGVpZ2h0IChoKSB7XG5cdGxldCByID0gdGhpcy5jZmcubGFuZUdhcCAvIHRoaXMuY2ZnLmZlYXRIZWlnaHQ7XG4gICAgICAgIHRoaXMuY2ZnLmZlYXRIZWlnaHQgPSBoO1xuXHR0aGlzLmNmZy5sYW5lR2FwID0gciAqIGg7XG5cdHRoaXMuY2ZnLmxhbmVIZWlnaHQgPSB0aGlzLmNmZy5mZWF0SGVpZ2h0ICsgdGhpcy5jZmcubGFuZUdhcDtcblx0dGhpcy5jZmcuYmxvY2tIZWlnaHQgPSB0aGlzLmNmZy5sYW5lSGVpZ2h0ICogdGhpcy5jZmcubWluTGFuZXMgKiAyO1xuXHR0aGlzLnVwZGF0ZSgpO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXQgbGFuZUdhcCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNmZy5sYW5lR2FwO1xuICAgIH1cbiAgICBzZXQgbGFuZUdhcCAoZykge1xuICAgICAgICB0aGlzLmNmZy5sYW5lR2FwID0gZztcblx0dGhpcy5jZmcubGFuZUhlaWdodCA9IHRoaXMuY2ZnLmZlYXRIZWlnaHQgKyB0aGlzLmNmZy5sYW5lR2FwO1xuXHR0aGlzLmNmZy5ibG9ja0hlaWdodCA9IHRoaXMuY2ZnLmxhbmVIZWlnaHQgKiB0aGlzLmNmZy5taW5MYW5lcyAqIDI7XG5cdHRoaXMudXBkYXRlKCk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldCBzdHJpcEdhcCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNmZy5zdHJpcEdhcDtcbiAgICB9XG4gICAgc2V0IHN0cmlwR2FwIChnKSB7XG4gICAgICAgIHRoaXMuY2ZnLnN0cmlwR2FwID0gZztcblx0dGhpcy5jZmcudG9wT2Zmc2V0ID0gZztcblx0dGhpcy51cGRhdGUoKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXQgaGlnaGxpZ2h0ZWQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oaUZlYXRzID8gT2JqZWN0LmtleXModGhpcy5oaUZlYXRzKSA6IFtdO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNob3dGbG9hdGluZ1RleHQgKHRleHQsIHgsIHkpIHtcblx0bGV0IHNyID0gdGhpcy5zdmcubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHR4ID0geC1zci54LTEyO1xuXHR5ID0geS1zci55O1xuXHRsZXQgYW5jaG9yID0geCA8IDYwID8gJ3N0YXJ0JyA6IHRoaXMud2lkdGgteCA8IDYwID8gJ2VuZCcgOiAnbWlkZGxlJztcblx0dGhpcy5mbG9hdGluZ1RleHQuc2VsZWN0KCd0ZXh0Jylcblx0ICAgIC50ZXh0KHRleHQpXG5cdCAgICAuc3R5bGUoJ3RleHQtYW5jaG9yJyxhbmNob3IpXG5cdCAgICAuYXR0cigneCcsIHgpXG5cdCAgICAuYXR0cigneScsIHkpXG4gICAgfVxuICAgIGhpZGVGbG9hdGluZ1RleHQgKCkge1xuXHR0aGlzLmZsb2F0aW5nVGV4dC5zZWxlY3QoJ3RleHQnKS50ZXh0KCcnKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW5pdENvbnRleHRNZW51IChpdGVtcyxvYmopIHtcblx0dGhpcy5jeHRNZW51LnNlbGVjdEFsbCgnLm1lbnVJdGVtJykucmVtb3ZlKCk7IC8vIGluIGNhc2Ugb2YgcmUtaW5pdFxuICAgICAgICBsZXQgbWl0ZW1zID0gdGhpcy5jeHRNZW51XG5cdCAgLnNlbGVjdEFsbCgnLm1lbnVJdGVtJylcblx0ICAuZGF0YShpdGVtcyk7XG5cdGxldCBuZXdzID0gbWl0ZW1zLmVudGVyKClcblx0ICAuYXBwZW5kKCdkaXYnKVxuXHQgIC5hdHRyKCdjbGFzcycsIChkKSA9PiBgbWVudUl0ZW0gZmxleHJvdyAke2QuY2xzfHwnJ31gKVxuXHQgIC5jbGFzc2VkKCdkaXNhYmxlZCcsIGQgPT4gZC5kaXNhYmxlciA/IGQuZGlzYWJsZXIob2JqKSA6IGZhbHNlKVxuXHQgIC5hdHRyKCduYW1lJywgZCA9PiBkLm5hbWUgfHwgbnVsbCApXG5cdCAgLmF0dHIoJ3RpdGxlJywgZCA9PiBkLnRvb2x0aXAgfHwgbnVsbCApO1xuXG5cdGxldCBoYW5kbGVyID0gZCA9PiB7XG5cdCAgICAgIGlmIChkLmRpc2FibGVyICYmIGQuZGlzYWJsZXIob2JqKSlcblx0ICAgICAgICAgIHJldHVybjtcblx0ICAgICAgZC5oYW5kbGVyICYmIGQuaGFuZGxlcihvYmopO1xuXHQgICAgICB0aGlzLmhpZGVDb250ZXh0TWVudSgpO1xuXHQgICAgICBkMy5ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICAgICAgZDMuZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0fTtcblx0bmV3cy5hcHBlbmQoJ2xhYmVsJylcblx0ICAudGV4dChkID0+IHR5cGVvZihkLmxhYmVsKSA9PT0gJ2Z1bmN0aW9uJyA/IGQubGFiZWwob2JqKSA6IGQubGFiZWwpXG5cdCAgLm9uKCdjbGljaycsIGhhbmRsZXIpXG5cdCAgLm9uKCdjb250ZXh0bWVudScsIGhhbmRsZXIpO1xuXHRuZXdzLmFwcGVuZCgnaScpXG5cdCAgLmF0dHIoJ2NsYXNzJywgJ21hdGVyaWFsLWljb25zJylcblx0ICAudGV4dCggZD0+ZC5pY29uICk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHNob3dDb250ZXh0TWVudSAoY2ZnLGYseCx5KSB7XG4gICAgICAgIHRoaXMuaW5pdENvbnRleHRNZW51KGNmZywgZik7XG4gICAgICAgIHRoaXMuY3h0TWVudVxuXHQgICAgLmNsYXNzZWQoJ3Nob3dpbmcnLCB0cnVlKVxuXHQgICAgLnN0eWxlKCdsZWZ0JywgYCR7eH1weGApXG5cdCAgICAuc3R5bGUoJ3RvcCcsIGAke3l9cHhgKVxuXHQgICAgO1xuXHRpZiAoZikge1xuXHQgICAgdGhpcy5jeHRNZW51Lm9uKCdtb3VzZWVudGVyJywgKCk9PnRoaXMuaGlnaGxpZ2h0KGYpKTtcblx0ICAgIHRoaXMuY3h0TWVudS5vbignbW91c2VsZWF2ZScsICgpPT4ge1xuXHQgICAgICAgIHRoaXMuaGlnaGxpZ2h0KCk7XG5cdFx0dGhpcy5oaWRlQ29udGV4dE1lbnUoKTtcblx0ICAgIH0pO1xuXHR9XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGhpZGVDb250ZXh0TWVudSAoKSB7XG4gICAgICAgIHRoaXMuY3h0TWVudS5jbGFzc2VkKCdzaG93aW5nJywgZmFsc2UpO1xuXHR0aGlzLmN4dE1lbnUub24oJ21vdXNlZW50ZXInLCBudWxsKTtcblx0dGhpcy5jeHRNZW51Lm9uKCdtb3VzZWxlYXZlJywgbnVsbCk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICAgZ3MgKGxpc3Qgb2YgR2Vub21lcylcbiAgICAvLyBTaWRlIGVmZmVjdHM6XG4gICAgLy8gICAgIEZvciBlYWNoIEdlbm9tZSwgc2V0cyBnLnpvb21ZIFxuICAgIHNldCBnZW5vbWVzIChncykge1xuICAgICAgIGxldCBvZmZzZXQgPSB0aGlzLmNmZy50b3BPZmZzZXQ7XG4gICAgICAgZ3MuZm9yRWFjaCggZyA9PiB7XG4gICAgICAgICAgIGcuem9vbVkgPSBvZmZzZXQ7XG5cdCAgIG9mZnNldCArPSB0aGlzLmNmZy5taW5TdHJpcEhlaWdodCArIHRoaXMuY2ZnLnN0cmlwR2FwO1xuICAgICAgIH0pO1xuICAgICAgIHRoaXMuX2dlbm9tZXMgPSBncztcbiAgICB9XG4gICAgZ2V0IGdlbm9tZXMgKCkge1xuICAgICAgIHJldHVybiB0aGlzLl9nZW5vbWVzO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBSZXR1cm5zIHRoZSBuYW1lcyBvZiB0aGUgY3VycmVudGx5IGRpc3BsYXllZCBnZW5vbWVzIChzdHJpcGVzKSBpbiB0b3AtdG8tYm90dG9tIG9yZGVyLlxuICAgIC8vXG4gICAgZ2V0R2Vub21lWU9yZGVyICgpIHtcbiAgICAgICAgbGV0IHN0cmlwcyA9IHRoaXMuc3ZnTWFpbi5zZWxlY3RBbGwoJy56b29tU3RyaXAnKTtcbiAgICAgICAgbGV0IHNzID0gc3RyaXBzWzBdLm1hcChnPT4ge1xuXHQgICAgbGV0IGJiID0gZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0ICAgIHJldHVybiBbYmIueSwgZy5fX2RhdGFfXy5nZW5vbWUubmFtZV07XG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgbnMgPSBzcy5zb3J0KCAoYSxiKSA9PiBhWzBdIC0gYlswXSApLm1hcCggeCA9PiB4WzFdIClcblx0cmV0dXJuIG5zO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTZXRzIHRoZSB0b3AtdG8tYm90dG9tIG9yZGVyIG9mIHRoZSBjdXJyZW50bHkgZGlzcGxheWVkIGdlbm9tZXMgYWNjb3JkaW5nIHRvIFxuICAgIC8vIHRoZSBnaXZlbiBuYW1lIGxpc3Qgb2YgbmFtZXMuIEJlY2F1c2Ugd2UgY2FuJ3QgZ3VhcmFudGVlIHRoZSBnaXZlbiBuYW1lcyBjb3JyZXNwb25kXG4gICAgLy8gdG8gYWN0dWFsIHpvb20gc3RyaXBzLCBvciB0aGF0IGFsbCBzdHJpcHMgYXJlIHJlcHJlc2VudGVkLCBldGMuXG4gICAgLy8gVGhlcmVmb3JlLCB0aGUgbGlzdCBpcyBwcmVwcmVjZXNzZWQgYXMgZm9sbG93czpcbiAgICAvLyAgICAgKiBkdXBsaWNhdGUgbmFtZXMsIGlmIHRoZXkgZXhpc3QsIGFyZSByZW1vdmVkXG4gICAgLy8gICAgICogbmFtZXMgdGhhdCBkbyBub3QgY29ycmVzcG9uZCB0byBleGlzdGluZyB6b29tU3RyaXBzIGFyZSByZW1vdmVkXG4gICAgLy8gICAgICogbmFtZXMgb2YgZXhpc3Rpbmcgem9vbSBzdHJpcHMgdGhhdCBkb24ndCBhcHBlYXIgaW4gdGhlIGxpc3QgYXJlIGFkZGVkIHRvIHRoZSBlbmRcbiAgICAvLyBUaGUgcmVzdWx0IGlzIGEgbGlzdCBvZiBuYW1lcyB3aXRoIHRoZXNlIHByb3BlcnRpZXM6XG4gICAgLy8gICAgICogdGhlcmUgaXMgYSAxOjEgY29ycmVzcG9uZGVuY2UgYmV0d2VlbiBuYW1lcyBhbmQgYWN0dWFsIHpvb20gc3RyaXBzXG4gICAgLy8gICAgICogdGhlIG5hbWUgb3JkZXIgaXMgY29uc2lzdGVudCB3aXRoIHRoZSBpbnB1dCBsaXN0XG4gICAgLy8gVGhpcyBpcyB0aGUgbGlzdCB1c2VkIHRvIChyZSlvcmRlciB0aGUgem9vbSBzdHJpcHMuXG4gICAgLy9cbiAgICAvLyBHaXZlbiB0aGUgbGlzdCBvcmRlcjogXG4gICAgLy8gICAgICogYSBZLXBvc2l0aW9uIGlzIGFzc2lnbmVkIHRvIGVhY2ggZ2Vub21lXG4gICAgLy8gICAgICogem9vbSBzdHJpcHMgdGhhdCBhcmUgTk9UIENVUlJFTlRMWSBCRUlORyBEUkFHR0VEIGFyZSB0cmFuc2xhdGVkIHRvIHRoZWlyIG5ldyBsb2NhdGlvbnNcbiAgICAvL1xuICAgIC8vIEFyZ3M6XG4gICAgLy8gICAgIG5zIChsaXN0IG9mIHN0cmluZ3MpIE5hbWVzIG9mIHRoZSBnZW5vbWVzLlxuICAgIC8vIFJldHVybnM6XG4gICAgLy8gICAgIG5vdGhpbmdcbiAgICAvLyBTaWRlIGVmZmVjdHM6XG4gICAgLy8gICAgIFJlY2FsY3VsYXRlcyB0aGUgWS1jb29yZGluYXRlcyBmb3IgZWFjaCBzdHJpcCBiYXNlZCBvbiB0aGUgZ2l2ZW4gb3JkZXIsIHRoZW4gdHJhbnNsYXRlc1xuICAgIC8vICAgICBlYWNoIHN0cmlwIHRvIGl0cyBuZXcgcG9zaXRpb24uXG4gICAgLy9cbiAgICBzZXRHZW5vbWVZT3JkZXIgKG5zKSB7XG5cdHRoaXMuZ2Vub21lcyA9IHJlbW92ZUR1cHMobnMpLm1hcChuPT4gdGhpcy5hcHAubmFtZTJnZW5vbWVbbl0gKS5maWx0ZXIoeD0+eCk7XG5cdGxldCBvID0gdGhpcy5jZmcudG9wT2Zmc2V0O1xuICAgICAgICB0aGlzLmdlbm9tZXMuZm9yRWFjaCggKGcsaSkgPT4ge1xuXHQgICAgbGV0IHN0cmlwID0gZDMuc2VsZWN0KGAjem9vbVZpZXcgLnpvb21TdHJpcFtuYW1lPVwiJHtnLm5hbWV9XCJdYCk7XG5cdCAgICBpZiAoIXN0cmlwLmNsYXNzZWQoJ2RyYWdnaW5nJykpXG5cdCAgICAgICAgc3RyaXAuYXR0cigndHJhbnNmb3JtJywgZ2QgPT4gYHRyYW5zbGF0ZSgwLCR7byArIGdkLnplcm9PZmZzZXR9KWApO1xuXHQgICAgbyArPSBzdHJpcC5kYXRhKClbMF0uc3RyaXBIZWlnaHQgKyB0aGlzLmNmZy5zdHJpcEdhcDtcblx0fSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmV0dXJucyBhIGRyYWdnZXIgKGQzLmJlaGF2aW9yLmRyYWcpIHRvIGJlIGF0dGFjaGVkIHRvIGVhY2ggem9vbSBzdHJpcC5cbiAgICAvLyBBbGxvd3Mgc3RyaXBzIHRvIGJlIHJlb3JkZXJlZCBieSBkcmFnZ2luZy5cbiAgICBnZXREcmFnZ2VyICgpIHsgIFxuICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgcmV0dXJuIGQzLmJlaGF2aW9yLmRyYWcoKVxuXHQgIC5vcmlnaW4oZnVuY3Rpb24oZCxpKXtcblx0ICAgICAgcmV0dXJuIHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgfSlcbiAgICAgICAgICAub24oJ2RyYWdzdGFydC56JywgZnVuY3Rpb24oZykge1xuXHQgICAgICBsZXQgdCA9IGQzLmV2ZW50LnNvdXJjZUV2ZW50LnRhcmdldDtcblx0ICAgICAgaWYgKGQzLmV2ZW50LnNvdXJjZUV2ZW50LnNoaWZ0S2V5IHx8ICEgZDMuc2VsZWN0KHQpLmNsYXNzZWQoJ3pvb21TdHJpcEhhbmRsZScpKXtcblx0ICAgICAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgICAgfVxuXHQgICAgICBkMy5ldmVudC5zb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0ICAgICAgbGV0IHN0cmlwID0gdGhpcy5jbG9zZXN0KCcuem9vbVN0cmlwJyk7XG5cdCAgICAgIHNlbGYuZHJhZ2dpbmcgPSBkMy5zZWxlY3Qoc3RyaXApLmNsYXNzZWQoJ2RyYWdnaW5nJywgdHJ1ZSk7XG5cdCAgfSlcblx0ICAub24oJ2RyYWcueicsIGZ1bmN0aW9uIChnKSB7XG5cdCAgICAgIGlmICghc2VsZi5kcmFnZ2luZykgcmV0dXJuO1xuXHQgICAgICBsZXQgbXggPSBkMy5tb3VzZShzZWxmLnN2Z01haW5bMF1bMF0pWzBdO1xuXHQgICAgICBsZXQgbXkgPSBkMy5tb3VzZShzZWxmLnN2Z01haW5bMF1bMF0pWzFdO1xuXHQgICAgICBzZWxmLmRyYWdnaW5nLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoMCwgJHtteX0pYCk7XG5cdCAgICAgIHNlbGYuc2V0R2Vub21lWU9yZGVyKHNlbGYuZ2V0R2Vub21lWU9yZGVyKCkpO1xuXHQgICAgICBzZWxmLmRyYXdGaWR1Y2lhbHMoKTtcblx0ICB9KVxuXHQgIC5vbignZHJhZ2VuZC56JywgZnVuY3Rpb24gKGcpIHtcblx0ICAgICAgaWYgKCFzZWxmLmRyYWdnaW5nKSByZXR1cm47XG5cdCAgICAgIC8vXG5cdCAgICAgIHNlbGYuZHJhZ2dpbmcuY2xhc3NlZCgnZHJhZ2dpbmcnLCBmYWxzZSk7XG5cdCAgICAgIHNlbGYuZHJhZ2dpbmcgPSBudWxsO1xuXHQgICAgICBzZWxmLnNldEdlbm9tZVlPcmRlcihzZWxmLmdldEdlbm9tZVlPcmRlcigpKTtcblx0ICAgICAgc2VsZi5hcHAuc2V0Q29udGV4dCh7IGdlbm9tZXM6IHNlbGYuZ2V0R2Vub21lWU9yZGVyKCkgfSk7XG5cdCAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCBzZWxmLmRyYXdGaWR1Y2lhbHMuYmluZChzZWxmKSwgNTAgKTtcblx0ICB9KVxuXHQgIDtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBjbGVhckJydXNoZXMgKCkge1xuXHR0aGlzLnJvb3Quc2VsZWN0QWxsKCdnLmJydXNoJylcblx0ICAgIC5lYWNoKCBmdW5jdGlvbiAoYikge1xuXHQgICAgICAgIGIuYnJ1c2guY2xlYXIoKTtcblx0XHRkMy5zZWxlY3QodGhpcykuY2FsbChiLmJydXNoKTtcblx0ICAgIH0pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJldHVybnMgdGhlIGN1cnJlbnQgYnJ1c2ggY29vcmRpbmF0ZXMsIHRyYW5zbGF0ZWQgKGlmIG5lZWRlZCkgdG8gcmVmIGdlbm9tZSBjb29yZGluYXRlcy5cbiAgICBiYkdldFJlZkNvb3JkcyAoKSB7XG4gICAgICBsZXQgcmcgPSB0aGlzLmFwcC5yR2Vub21lO1xuICAgICAgbGV0IGJsayA9IHRoaXMuYnJ1c2hpbmc7XG4gICAgICBsZXQgZXh0ID0gYmxrLmJydXNoLmV4dGVudCgpO1xuICAgICAgbGV0IHIgPSB7IGNocjogYmxrLmNociwgc3RhcnQ6IGV4dFswXSwgZW5kOiBleHRbMV0sIGJsb2NrSWQ6YmxrLmJsb2NrSWQgfTtcbiAgICAgIGxldCB0ciA9IHRoaXMuYXBwLnRyYW5zbGF0b3I7XG4gICAgICBpZiggYmxrLmdlbm9tZSAhPT0gcmcgKSB7XG4gICAgICAgICAvLyB1c2VyIGlzIGJydXNoaW5nIGEgY29tcCBnZW5vbWVzIHNvIGZpcnN0IHRyYW5zbGF0ZVxuXHQgLy8gY29vcmRpbmF0ZXMgdG8gcmVmIGdlbm9tZVxuXHQgbGV0IHJzID0gdGhpcy5hcHAudHJhbnNsYXRvci50cmFuc2xhdGUoYmxrLmdlbm9tZSwgci5jaHIsIHIuc3RhcnQsIHIuZW5kLCByZyk7XG5cdCBpZiAocnMubGVuZ3RoID09PSAwKSByZXR1cm47XG5cdCByID0gcnNbMF07XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgICByLmJsb2NrSWQgPSByZy5uYW1lO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHI7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGhhbmRsZXIgZm9yIHRoZSBzdGFydCBvZiBhIGJydXNoIGFjdGlvbiBieSB0aGUgdXNlciBvbiBhIGJsb2NrXG4gICAgYmJTdGFydCAoYmxrLGJFbHQpIHtcbiAgICAgIHRoaXMuYnJ1c2hpbmcgPSBibGs7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGJiQnJ1c2ggKCkge1xuICAgICAgICBsZXQgZXYgPSBkMy5ldmVudC5zb3VyY2VFdmVudDtcblx0bGV0IHh0ID0gdGhpcy5icnVzaGluZy5icnVzaC5leHRlbnQoKTtcblx0bGV0IHMgPSBNYXRoLnJvdW5kKHh0WzBdKTtcblx0bGV0IGUgPSBNYXRoLnJvdW5kKHh0WzFdKTtcblx0dGhpcy5zaG93RmxvYXRpbmdUZXh0KGAke3RoaXMuYnJ1c2hpbmcuY2hyfToke3N9Li4ke2V9YCwgZXYuY2xpZW50WCwgZXYuY2xpZW50WSk7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGJiRW5kICgpIHtcbiAgICAgIGxldCBzZSA9IGQzLmV2ZW50LnNvdXJjZUV2ZW50O1xuICAgICAgbGV0IHh0ID0gdGhpcy5icnVzaGluZy5icnVzaC5leHRlbnQoKTtcbiAgICAgIGxldCBnID0gdGhpcy5icnVzaGluZy5nZW5vbWUubGFiZWw7XG4gICAgICAvL1xuICAgICAgdGhpcy5oaWRlRmxvYXRpbmdUZXh0KCk7XG4gICAgICAvL1xuICAgICAgaWYgKHNlLmN0cmxLZXkgfHwgc2UuYWx0S2V5IHx8IHNlLm1ldGFLZXkpIHtcblx0ICB0aGlzLmNsZWFyQnJ1c2hlcygpO1xuXHQgIHRoaXMuYnJ1c2hpbmcgPSBudWxsO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vXG4gICAgICBpZiAoTWF0aC5hYnMoeHRbMF0gLSB4dFsxXSkgPD0gMTApIHtcblx0ICAvLyBVc2VyIGNsaWNrZWQuIFJlY2VudGVyIHZpZXcgb24gdGhlIGNsaWNrZWQgY29vcmRpbmF0ZS4gXG5cdCAgLy8gV2hpY2hldmVyIGdlbm9tZSB0aGUgdXNlciBjbGlja2VkIGluIGJlY29tZXMgdGhlIHJlZmVyZW5jZS5cblx0ICAvLyBUaGUgY2xpY2tlZCBjb29yZGluYXRlOlxuXHQgIGxldCB4bWlkID0gKHh0WzBdICsgeHRbMV0pLzI7XG5cdCAgLy8gc2l6ZSBvZiB2aWV3XG5cdCAgbGV0IHcgPSB0aGlzLmFwcC5jb29yZHMuZW5kIC0gdGhpcy5hcHAuY29vcmRzLnN0YXJ0ICsgMTtcblx0ICAvLyBzdGFydGluZyBjb29yZGluYXRlIGluIGNsaWNrZWQgZ2Vub21lIG9mIG5ldyB2aWV3XG5cdCAgbGV0IHMgPSBNYXRoLnJvdW5kKHhtaWQgLSB3LzIpO1xuXHQgIC8vXG5cdCAgbGV0IG5ld0NvbnRleHQgPSB7IHJlZjpnLCBjaHI6IHRoaXMuYnJ1c2hpbmcuY2hyLCBzdGFydDogcywgZW5kOiBzICsgdyAtIDEgfTtcblx0ICBpZiAodGhpcy5jbW9kZSA9PT0gJ2xhbmRtYXJrJykge1xuXHQgICAgICBsZXQgbG1mID0gdGhpcy5jb250ZXh0LmxhbmRtYXJrRmVhdHMuZmlsdGVyKGYgPT4gZi5nZW5vbWUgPT09IHRoaXMuYnJ1c2hpbmcuZ2Vub21lKVswXTtcblx0ICAgICAgaWYgKGxtZikge1xuXHRcdCAgbGV0IG0gPSAodGhpcy5icnVzaGluZy5lbmQgKyB0aGlzLmJydXNoaW5nLnN0YXJ0KSAvIDI7XG5cdFx0ICBsZXQgZHggPSB4bWlkIC0gbTtcblx0XHQgIG5ld0NvbnRleHQgPSB7IHJlZjpnLCBkZWx0YTogdGhpcy5jb250ZXh0LmRlbHRhK2R4IH07XG5cdCAgICAgIH1cblx0ICB9XG5cdCAgdGhpcy5hcHAuc2V0Q29udGV4dChuZXdDb250ZXh0KTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuXHQgIC8vIFVzZXIgZHJhZ2dlZC4gWm9vbSBpbiBvciBvdXQuXG5cdCAgdGhpcy5hcHAuc2V0Q29udGV4dCh7IHJlZjpnLCBjaHI6IHRoaXMuYnJ1c2hpbmcuY2hyLCBzdGFydDp4dFswXSwgZW5kOnh0WzFdIH0pO1xuICAgICAgfVxuICAgICAgdGhpcy5jbGVhckJydXNoZXMoKTtcbiAgICAgIHRoaXMuYnJ1c2hpbmcgPSBudWxsO1xuICAgICAgdGhpcy5kZWFsV2l0aFVud2FudGVkQ2xpY2tFdmVudCA9IHRydWU7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGhpZ2hsaWdodFN0cmlwIChnLCBlbHQpIHtcblx0aWYgKGcgPT09IHRoaXMuY3VycmVudEhMRykgcmV0dXJuO1xuXHR0aGlzLmN1cnJlbnRITEcgPSBnO1xuXHQvL1xuXHR0aGlzLnN2Z01haW4uc2VsZWN0QWxsKCcuem9vbVN0cmlwJylcblx0ICAgIC5jbGFzc2VkKCdoaWdobGlnaHRlZCcsIGQgPT4gZC5nZW5vbWUgPT09IGcpO1xuXHR0aGlzLmFwcC5zaG93QmxvY2tzKGcpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEJhc2VkIG9uIHRoZSBnaXZlbiBjb29yZGluYXRlIHJhbmdlLCBzZXRzIHRoZSBzaG93RmVhdHVyZURldGFpbHMgZmxhZyB0byB0cnVlIG9yIGZhbHNlLlxuICAgIC8vIEFsc28gc2V0cyB0aGUgY2xlYXJBbGwgZmxhZyB0byB0cnVlIGlmIHRoZSBzaG93RmVhdHVyZURldGFpbHMgZmxhZyBjaGFuZ2VkIHZhbHVlLlxuICAgIC8vXG4gICAgc2V0U2hvd0ZlYXR1cmVEZXRhaWxzIChjKSB7XG5cdC8vXG5cdGxldCBwcmV2U0ZEID0gdGhpcy5zaG93RmVhdHVyZURldGFpbHM7XG5cdHRoaXMuc2hvd0ZlYXR1cmVEZXRhaWxzID0gKGMuZW5kIC0gYy5zdGFydCArIDEpIDw9IHRoaXMuY2ZnLmZlYXR1cmVEZXRhaWxUaHJlc2hvbGQ7XG5cdHRoaXMuY2xlYXJBbGwgPSBwcmV2U0ZEICE9PSB0aGlzLnNob3dGZWF0dXJlRGV0YWlscztcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBVcGRhdGVzIHRoZSBab29tVmlldyB0byBzaG93IHRoZSBnaXZlbiBjb29yZGluYXRlIHJhbmdlIGZyb20gdGhlIHJlZyBnZW5vbWUgYW5kIHRoZSBjb3JyZXNwb25kaW5nXG4gICAgLy8gcmFuZ2UocykgaW4gZWFjaCBjb21wYXJpc29uIGdlbm9tZS5cbiAgICAvL1xuICAgIHVwZGF0ZVZpYU1hcHBlZENvb3JkaW5hdGVzIChjb29yZHMpIHtcblx0bGV0IGMgPSAoY29vcmRzIHx8IHRoaXMuYXBwLmNvb3Jkcyk7XG5cdGQzLnNlbGVjdCgnI3pvb21Db29yZHMnKVswXVswXS52YWx1ZSA9IGZvcm1hdENvb3JkcyhjLmNociwgYy5zdGFydCwgYy5lbmQpO1xuXHRkMy5zZWxlY3QoJyN6b29tV1NpemUnKVswXVswXS52YWx1ZSA9IE1hdGgucm91bmQoYy5lbmQgLSBjLnN0YXJ0ICsgMSlcblx0Ly9cbiAgICAgICAgbGV0IG1ndiA9IHRoaXMuYXBwO1xuXHQvLyBJc3N1ZSByZXF1ZXN0cyBmb3IgZmVhdHVyZXMuIE9uZSByZXF1ZXN0IHBlciBnZW5vbWUsIGVhY2ggcmVxdWVzdCBzcGVjaWZpZXMgb25lIG9yIG1vcmVcblx0Ly8gY29vcmRpbmF0ZSByYW5nZXMuXG5cdC8vIFdhaXQgZm9yIGFsbCB0aGUgZGF0YSB0byBiZWNvbWUgYXZhaWxhYmxlLCB0aGVuIGRyYXcuXG5cdC8vXG5cdGxldCBwcm9taXNlcyA9IFtdO1xuXG5cdC8vXG5cdHRoaXMuc2V0U2hvd0ZlYXR1cmVEZXRhaWxzKGMpO1xuXG5cdC8vIEZpcnN0IHJlcXVlc3QgaXMgZm9yIHRoZSB0aGUgcmVmZXJlbmNlIGdlbm9tZS4gR2V0IGFsbCB0aGUgZmVhdHVyZXMgaW4gdGhlIHJhbmdlLlxuXHRwcm9taXNlcy5wdXNoKG1ndi5mZWF0dXJlTWFuYWdlci5nZXRGZWF0dXJlc0J5UmFuZ2UobWd2LnJHZW5vbWUsIFt7XG5cdCAgICAvLyBOZWVkIHRvIHNpbXVsYXRlIHRoZSByZXN1bHRzIGZyb20gY2FsbGluZyB0aGUgdHJhbnNsYXRvci4gXG5cdCAgICAvLyBcblx0ICAgIGNociAgICA6IGMuY2hyLFxuXHQgICAgc3RhcnQgIDogYy5zdGFydCxcblx0ICAgIGVuZCAgICA6IGMuZW5kLFxuXHQgICAgaW5kZXggIDogMCxcblx0ICAgIGZDaHIgICA6IGMuY2hyLFxuXHQgICAgZlN0YXJ0IDogYy5zdGFydCxcblx0ICAgIGZFbmQgICA6IGMuZW5kLFxuXHQgICAgZkluZGV4ICA6IDAsXG5cdCAgICBvcmkgICAgOiAnKycsXG5cdCAgICBibG9ja0lkOiBtZ3Yuckdlbm9tZS5uYW1lXG5cdH1dLCB0aGlzLnNob3dGZWF0dXJlRGV0YWlscykpO1xuXHRpZiAoISB0aGlzLnJvb3QuY2xhc3NlZCgnY2xvc2VkJykpIHtcblx0ICAgIC8vIEFkZCBhIHJlcXVlc3QgZm9yIGVhY2ggY29tcGFyaXNvbiBnZW5vbWUsIHVzaW5nIHRyYW5zbGF0ZWQgY29vcmRpbmF0ZXMuIFxuXHQgICAgbWd2LmNHZW5vbWVzLmZvckVhY2goY0dlbm9tZSA9PiB7XG5cdFx0bGV0IHJhbmdlcyA9IG1ndi50cmFuc2xhdG9yLnRyYW5zbGF0ZSggbWd2LnJHZW5vbWUsIGMuY2hyLCBjLnN0YXJ0LCBjLmVuZCwgY0dlbm9tZSApO1xuXHRcdGxldCBwID0gbWd2LmZlYXR1cmVNYW5hZ2VyLmdldEZlYXR1cmVzQnlSYW5nZShjR2Vub21lLCByYW5nZXMsIHRoaXMuc2hvd0ZlYXR1cmVEZXRhaWxzKTtcblx0XHRwcm9taXNlcy5wdXNoKHApO1xuXHQgICAgfSk7XG5cdH1cblx0cmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKVxuICAgIH1cbiAgICAvLyBVcGRhdGVzIHRoZSBab29tVmlldyB0byBzaG93IHRoZSByZWdpb24gYXJvdW5kIGEgbGFuZG1hcmsgaW4gZWFjaCBnZW5vbWUuXG4gICAgLy9cbiAgICAvLyBjb29yZHMgPSB7XG4gICAgLy8gICAgIGxhbmRtYXJrIDogaWQgb2YgYSBmZWF0dXJlIHRvIHVzZSBhcyBhIHJlZmVyZW5jZVxuICAgIC8vICAgICBmbGFua3x3aWR0aCA6IHNwZWNpZnkgb25lIG9mIGZsYW5rIG9yIHdpZHRoLiBcbiAgICAvLyAgICAgICAgIGZsYW5rID0gYW1vdW50IG9mIGZsYW5raW5nIHJlZ2lvbiAoYnApIHRvIGluY2x1ZGUgYXQgYm90aCBlbmRzIG9mIHRoZSBsYW5kbWFyaywgXG4gICAgLy8gICAgICAgICBzbyB0aGUgdG90YWwgdmlld2luZyByZWdpb24gPSBmbGFuayArIGxlbmd0aChsYW5kbWFyaykgKyBmbGFuay5cbiAgICAvLyAgICAgICAgIHdpZHRoID0gdG90YWwgdmlld2luZyByZWdpb24gd2lkdGguIElmIGJvdGggd2lkdGggYW5kIGZsYW5rIGFyZSBzcGVjaWZpZWQsIGZsYW5rIGlzIGlnbm9yZWQuXG4gICAgLy8gICAgIGRlbHRhIDogYW1vdW50IHRvIHNoaWZ0IHRoZSB2aWV3IGxlZnQvcmlnaHRcbiAgICAvLyB9XG4gICAgLy8gXG4gICAgLy8gVGhlIGxhbmRtYXJrIG11c3QgZXhpc3QgaW4gdGhlIGN1cnJlbnQgcmVmZXJlbmNlIGdlbm9tZS4gXG4gICAgLy9cbiAgICB1cGRhdGVWaWFMYW5kbWFya0Nvb3JkaW5hdGVzIChjb29yZHMpIHtcblx0bGV0IGMgPSBjb29yZHM7XG5cdGxldCBtZ3YgPSB0aGlzLmFwcDtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXHRsZXQgcmYgPSBjb29yZHMubGFuZG1hcmtSZWZGZWF0O1xuXHRsZXQgZmVhdHMgPSBjb29yZHMubGFuZG1hcmtGZWF0cztcblx0aWYgKHRoaXMucm9vdC5jbGFzc2VkKCdjbG9zZWQnKSlcblx0ICAgIGZlYXRzID0gZmVhdHMuZmlsdGVyKGYgPT4gZi5nZW5vbWUgPT09IHRoaXMuYXBwLnJHZW5vbWUpO1xuXHRsZXQgZGVsdGEgPSBjb29yZHMuZGVsdGEgfHwgMDtcblxuXHQvLyBjb21wdXRlIHJhbmdlcyBhcm91bmQgbGFuZG1hcmsgaW4gZWFjaCBnZW5vbWVcblx0bGV0IHJhbmdlcyA9IGZlYXRzLm1hcChmID0+IHtcblx0ICAgIGxldCBmbGFuayA9IGMubGVuZ3RoID8gKGMubGVuZ3RoIC0gZi5sZW5ndGgpIC8gMiA6IGMuZmxhbms7XG5cdCAgICBsZXQgY2xlbmd0aCA9IGYuZ2Vub21lLmdldENocm9tb3NvbWUoZi5jaHIpLmxlbmd0aDtcblx0ICAgIGxldCB3ICAgICA9IGMubGVuZ3RoID8gYy5sZW5ndGggOiAoZi5sZW5ndGggKyAyKmZsYW5rKTtcblx0ICAgIGxldCBzaWduID0gZi5zdHJhbmQgPT09ICctJyA/IC0xIDogMTtcblx0ICAgIGxldCBzdGFydCA9IGNsaXAoTWF0aC5yb3VuZChkZWx0YSArIGYuc3RhcnQgLSBmbGFuayksIDEsIGNsZW5ndGgpO1xuXHQgICAgbGV0IGVuZCAgID0gY2xpcChNYXRoLnJvdW5kKHN0YXJ0ICsgdyksIHN0YXJ0LCBjbGVuZ3RoKVxuXHQgICAgbGV0IGZkZWx0YSA9IGYubGVuZ3RoIC8gMjtcblx0ICAgIGxldCByYW5nZSA9IHtcblx0XHRnZW5vbWU6XHQgICAgZi5nZW5vbWUsXG5cdFx0Y2hyOlx0ICAgIGYuY2hyLFxuXHRcdGNocm9tb3NvbWU6IGYuZ2Vub21lLmdldENocm9tb3NvbWUoZi5jaHIpLFxuXHRcdHN0YXJ0OiAgICAgIHN0YXJ0IC0gc2lnbiAqIGZkZWx0YSxcblx0XHRlbmQ6ICAgICAgICBlbmQgICAtIHNpZ24gKiBmZGVsdGFcblx0ICAgIH0gO1xuXHQgICAgaWYgKGYuZ2Vub21lID09PSBtZ3Yuckdlbm9tZSkge1xuXHRcdGxldCBjID0gdGhpcy5hcHAuY29vcmRzID0gcmFuZ2U7XG5cdFx0ZDMuc2VsZWN0KCcjem9vbUNvb3JkcycpWzBdWzBdLnZhbHVlID0gZm9ybWF0Q29vcmRzKGMuY2hyLCBjLnN0YXJ0LCBjLmVuZCk7XG5cdFx0ZDMuc2VsZWN0KCcjem9vbVdTaXplJylbMF1bMF0udmFsdWUgPSBNYXRoLnJvdW5kKGMuZW5kIC0gYy5zdGFydCArIDEpXG5cdCAgICB9XG5cdCAgICByZXR1cm4gcmFuZ2U7XG5cdH0pO1xuXHRsZXQgc2Vlbkdlbm9tZXMgPSBuZXcgU2V0KCk7XG5cdGxldCByQ29vcmRzO1xuXHQvLyBHZXQgKHByb21pc2VzIGZvcikgdGhlIGZlYXR1cmVzIGluIGVhY2ggcmFuZ2UuXG5cdGxldCBwcm9taXNlcyA9IHJhbmdlcy5tYXAociA9PiB7XG4gICAgICAgICAgICBsZXQgcnJzO1xuXHQgICAgc2Vlbkdlbm9tZXMuYWRkKHIuZ2Vub21lKTtcblx0ICAgIGlmIChyLmdlbm9tZSA9PT0gbWd2LnJHZW5vbWUpe1xuXHRcdC8vIHRoZSByZWYgZ2Vub21lIHJhbmdlXG5cdFx0ckNvb3JkcyA9IHI7XG5cdFx0Ly9cblx0XHR0aGlzLnNldFNob3dGZWF0dXJlRGV0YWlscyhyKTtcblx0XHQvL1xuXHQgICAgICAgIHJycyA9IFt7XG5cdFx0ICAgIGNociAgICA6IHIuY2hyLFxuXHRcdCAgICBzdGFydCAgOiByLnN0YXJ0LFxuXHRcdCAgICBlbmQgICAgOiByLmVuZCxcblx0XHQgICAgaW5kZXggIDogMCxcblx0XHQgICAgZkNociAgIDogci5jaHIsXG5cdFx0ICAgIGZTdGFydCA6IHIuc3RhcnQsXG5cdFx0ICAgIGZFbmQgICA6IHIuZW5kLFxuXHRcdCAgICBmSW5kZXggIDogMCxcblx0XHQgICAgb3JpICAgIDogJysnLFxuXHRcdCAgICBibG9ja0lkOiBtZ3Yuckdlbm9tZS5uYW1lXG5cdFx0fV07XG5cdCAgICB9XG5cdCAgICBlbHNlIHsgXG5cdFx0Ly8gdHVybiB0aGUgc2luZ2xlIHJhbmdlIGludG8gYSByYW5nZSBmb3IgZWFjaCBvdmVybGFwcGluZyBzeW50ZW55IGJsb2NrIHdpdGggdGhlIHJlZiBnZW5vbWVcblx0ICAgICAgICBycnMgPSBtZ3YudHJhbnNsYXRvci50cmFuc2xhdGUoci5nZW5vbWUsIHIuY2hyLCByLnN0YXJ0LCByLmVuZCwgbWd2LnJHZW5vbWUsIHRydWUpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIG1ndi5mZWF0dXJlTWFuYWdlci5nZXRGZWF0dXJlc0J5UmFuZ2Uoci5nZW5vbWUsIHJycywgdGhpcy5zaG93RmVhdHVyZURldGFpbHMpO1xuXHR9KTtcblx0Ly8gRm9yIGVhY2ggZ2Vub21lIHdoZXJlIHRoZSBsYW5kbWFyayBkb2VzIG5vdCBleGlzdCwgY29tcHV0ZSBhIG1hcHBlZCByYW5nZSAoYXMgaW4gbWFwcGVkIGNtb2RlKS5cblx0aWYgKCF0aGlzLnJvb3QuY2xhc3NlZCgnY2xvc2VkJykpXG5cdCAgICBtZ3YuY0dlbm9tZXMuZm9yRWFjaChnID0+IHtcblx0XHRpZiAoISBzZWVuR2Vub21lcy5oYXMoZykpIHtcblx0XHQgICAgbGV0IHJycyA9IG1ndi50cmFuc2xhdG9yLnRyYW5zbGF0ZShtZ3Yuckdlbm9tZSwgckNvb3Jkcy5jaHIsIHJDb29yZHMuc3RhcnQsIHJDb29yZHMuZW5kLCBnKTtcblx0XHQgICAgcHJvbWlzZXMucHVzaCggbWd2LmZlYXR1cmVNYW5hZ2VyLmdldEZlYXR1cmVzQnlSYW5nZShnLCBycnMsIHRoaXMuc2hvd0ZlYXR1cmVEZXRhaWxzKSApO1xuXHRcdH1cblx0ICAgIH0pO1xuXHQvLyBXaGVuIGFsbCB0aGUgZGF0YSBpcyByZWFkeSwgZHJhdy5cblx0cmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICB9XG4gICAgLy9cbiAgICB1cGRhdGUgKGNvbnRleHQpIHtcblx0dGhpcy5jb250ZXh0ID0gY29udGV4dCB8fCB0aGlzLmNvbnRleHQ7XG5cdHRoaXMuaGlnaGxpZ2h0ZWQgPSB0aGlzLmNvbnRleHQuaGlnaGxpZ2h0O1xuXHR0aGlzLmdlbm9tZXMgPSB0aGlzLmNvbnRleHQuZ2Vub21lcztcblx0dGhpcy5kbW9kZSA9IHRoaXMuY29udGV4dC5kbW9kZTtcblx0dGhpcy5jbW9kZSA9IHRoaXMuY29udGV4dC5jbW9kZTtcblx0dGhpcy5hcHAudHJhbnNsYXRvci5yZWFkeSgpLnRoZW4oKCkgPT4ge1xuXHQgICAgbGV0IHA7XG5cdCAgICBpZiAodGhpcy5jbW9kZSA9PT0gJ21hcHBlZCcpXG5cdFx0cCA9IHRoaXMudXBkYXRlVmlhTWFwcGVkQ29vcmRpbmF0ZXModGhpcy5hcHAuY29vcmRzKTtcblx0ICAgIGVsc2Vcblx0XHRwID0gdGhpcy51cGRhdGVWaWFMYW5kbWFya0Nvb3JkaW5hdGVzKHRoaXMuYXBwLmxjb29yZHMpO1xuXHQgICAgcC50aGVuKCBkYXRhID0+IHtcblx0XHR0aGlzLmRyYXcodGhpcy5tdW5nZURhdGEoZGF0YSkpO1xuXHQgICAgfSk7XG5cdH0pO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vXG4gICAgbWVyZ2VTYmxvY2tSdW5zIChkYXRhKSB7XG5cdC8vIC0tLS0tXG5cdC8vIFJlZHVjZXIgZnVuY3Rpb24uIFdpbGwgYmUgY2FsbGVkIHdpdGggdGhlc2UgYXJnczpcblx0Ly8gICBuYmxja3MgKGxpc3QpIE5ldyBibG9ja3MuIChjdXJyZW50IGFjY3VtdWxhdG9yIHZhbHVlKVxuXHQvLyAgIFx0QSBsaXN0IG9mIGxpc3RzIG9mIHN5bnRlbnkgYmxvY2tzLlxuXHQvLyAgIGJsayAoc3ludGVueSBibG9jaykgdGhlIGN1cnJlbnQgc3ludGVueSBibG9ja1xuXHQvLyAgIGkgKGludCkgVGhlIGl0ZXJhdGlvbiBjb3VudC5cblx0Ly8gUmV0dXJuczpcblx0Ly8gICBsaXN0IG9mIGxpc3RzIG9mIGJsb2Nrc1xuXHRsZXQgbWVyZ2VyID0gKG5ibGtzLCBiLCBpKSA9PiB7XG5cdCAgICBsZXQgaW5pdEJsayA9IGZ1bmN0aW9uIChiYikge1xuXHRcdGxldCBuYiA9IE9iamVjdC5hc3NpZ24oe30sIGJiKTtcblx0XHRuYi5zdXBlckJsb2NrID0gdHJ1ZTtcblx0XHRuYi5mZWF0dXJlcyA9IGJiLmZlYXR1cmVzLmNvbmNhdCgpO1xuXHRcdG5iLnNibG9ja3MgPSBbYmJdO1xuXHRcdG5iLm9yaSA9ICcrJ1xuXHRcdHJldHVybiBuYjtcblx0ICAgIH07XG5cdCAgICBpZiAoaSA9PT0gMCl7XG5cdFx0bmJsa3MucHVzaChpbml0QmxrKGIpKTtcblx0XHRyZXR1cm4gbmJsa3M7XG5cdCAgICB9XG5cdCAgICBsZXQgbGFzdEJsayA9IG5ibGtzW25ibGtzLmxlbmd0aCAtIDFdO1xuXHQgICAgaWYgKGIuY2hyICE9PSBsYXN0QmxrLmNociB8fCBiLmluZGV4IC0gbGFzdEJsay5pbmRleCAhPT0gMSkge1xuXHQgICAgICAgIG5ibGtzLnB1c2goaW5pdEJsayhiKSk7XG5cdFx0cmV0dXJuIG5ibGtzO1xuXHQgICAgfVxuXHQgICAgLy8gbWVyZ2Vcblx0ICAgIGxhc3RCbGsuaW5kZXggPSBiLmluZGV4O1xuXHQgICAgbGFzdEJsay5lbmQgPSBiLmVuZDtcblx0ICAgIGxhc3RCbGsuYmxvY2tFbmQgPSBiLmJsb2NrRW5kO1xuXHQgICAgbGFzdEJsay5mZWF0dXJlcyA9IGxhc3RCbGsuZmVhdHVyZXMuY29uY2F0KGIuZmVhdHVyZXMpO1xuXHQgICAgbGV0IGxhc3RTYiA9IGxhc3RCbGsuc2Jsb2Nrc1tsYXN0QmxrLnNibG9ja3MubGVuZ3RoIC0gMV07XG5cdCAgICBsZXQgZCA9IGIuc3RhcnQgLSBsYXN0U2IuZW5kO1xuXHQgICAgbGFzdFNiLmVuZCArPSBkLzI7XG5cdCAgICBiLnN0YXJ0IC09IGQvMjtcblx0ICAgIGxhc3RCbGsuc2Jsb2Nrcy5wdXNoKGIpO1xuXHQgICAgcmV0dXJuIG5ibGtzO1xuXHR9O1xuXHQvLyAtLS0tLVxuICAgICAgICBkYXRhLmZvckVhY2goKGdkYXRhLGkpID0+IHtcblx0ICAgIGlmICh0aGlzLmRtb2RlID09PSAnY29tcGFyaXNvbicpIHtcblx0XHRnZGF0YS5ibG9ja3Muc29ydCggKGEsYikgPT4gYS5pbmRleCAtIGIuaW5kZXggKTtcblx0XHRnZGF0YS5ibG9ja3MgPSBnZGF0YS5ibG9ja3MucmVkdWNlKG1lcmdlcixbXSk7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0XHQvLyBmaXJzdCBzb3J0IGJ5IHJlZiBnZW5vbWUgb3JkZXJcblx0XHRnZGF0YS5ibG9ja3Muc29ydCggKGEsYikgPT4gYS5mSW5kZXggLSBiLmZJbmRleCApO1xuXHRcdC8vIFN1Yi1ncm91cCBpbnRvIHJ1bnMgb2Ygc2FtZSBjb21wIGdlbm9tZSBjaHJvbW9zb21lLlxuXHRcdGxldCB0bXAgPSBnZGF0YS5ibG9ja3MucmVkdWNlKChuYnMsIGIsIGkpID0+IHtcblx0XHQgICAgaWYgKGkgPT09IDAgfHwgbmJzW25icy5sZW5ndGggLSAxXVswXS5jaHIgIT09IGIuY2hyKVxuXHRcdFx0bmJzLnB1c2goW2JdKTtcblx0XHQgICAgZWxzZVxuXHRcdFx0bmJzW25icy5sZW5ndGggLSAxXS5wdXNoKGIpO1xuXHRcdCAgICByZXR1cm4gbmJzO1xuXHRcdH0sIFtdKTtcblx0XHQvLyBTb3J0IGVhY2ggc3ViZ3JvdXAgaW50byBjb21wYXJpc29uIGdlbm9tZSBvcmRlclxuXHRcdHRtcC5mb3JFYWNoKCBzdWJncnAgPT4gc3ViZ3JwLnNvcnQoKGEsYikgPT4gYS5pbmRleCAtIGIuaW5kZXgpICk7XG5cdFx0Ly8gRmxhdHRlbiB0aGUgbGlzdFxuXHRcdHRtcCA9IHRtcC5yZWR1Y2UoKGxzdCwgY3VycikgPT4gbHN0LmNvbmNhdChjdXJyKSwgW10pO1xuXHRcdC8vIE5vdyBjcmVhdGUgdGhlIHN1cGVyZ3JvdXBzLlxuXHRcdGdkYXRhLmJsb2NrcyA9IHRtcC5yZWR1Y2UobWVyZ2VyLFtdKTtcblx0ICAgIH1cblx0fSk7XG5cdHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vXG4gICAgdW5pcWlmeUJsb2NrcyAoYmxvY2tzKSB7XG5cdC8vIGhlbHBlciBmdW5jdGlvbi4gV2hlbiBzYmxvY2sgcmVsYXRpb25zaGlwIGJldHdlZW4gZ2Vub21lcyBpcyBjb25mdXNlZCwgcmVxdWVzdGluZyBvbmVcblx0Ly8gcmVnaW9uIGluIGdlbm9tZSBBIGNhbiBlbmQgdXAgcmVxdWVzdGluZyB0aGUgc2FtZSByZWdpb24gaW4gZ2Vub21lIEIgbXVsdGlwbGUgdGltZXMuXG5cdC8vIFRoaXMgZnVuY3Rpb24gYXZvaWRzIGRyYXdpbmcgdGhlIHNhbWUgc2Jsb2NrIHR3aWNlLiAoTkI6IFJlYWxseSBub3Qgc3VyZSB3aGVyZSB0aGlzIFxuXHQvLyBjaGVjayBpcyBiZXN0IGRvbmUuIENvdWxkIHB1c2ggaXQgZmFydGhlciB1cHN0cmVhbS4pXG5cdGxldCBzZWVuID0gbmV3IFNldCgpO1xuXHRyZXR1cm4gYmxvY2tzLmZpbHRlciggYiA9PiB7IFxuXHQgICAgaWYgKHNlZW4uaGFzKGIuaW5kZXgpKSByZXR1cm4gZmFsc2U7XG5cdCAgICBzZWVuLmFkZChiLmluZGV4KTtcblx0ICAgIHJldHVybiB0cnVlO1xuXHR9KTtcbiAgICB9O1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEFwcGxpZXMgc2V2ZXJhbCB0cmFuc2Zvcm1hdGlvbiBzdGVwcyBvbiB0aGUgZGF0YSBhcyByZXR1cm5lZCBieSB0aGUgc2VydmVyIHRvIHByZXBhcmUgZm9yIGRyYXdpbmcuXG4gICAgLy8gSW5wdXQgZGF0YSBpcyBzdHJ1Y3R1cmVkIGFzIGZvbGxvd3M6XG4gICAgLy8gICAgIGRhdGEgPSBbIHpvb21TdHJpcF9kYXRhIF1cbiAgICAvLyAgICAgem9vbVN0cmlwX2RhdGEgPSB7IGdlbm9tZSBbIHpvb21CbG9ja19kYXRhIF0gfVxuICAgIC8vICAgICB6b29tQmxvY2tfZGF0YSA9IHsgeHNjYWxlLCBjaHIsIHN0YXJ0LCBlbmQsIGluZGV4LCBmQ2hyLCBmU3RhcnQsIGZFbmQsIGZJbmRleCwgb3JpLCBbIGZlYXR1cmVfZGF0YSBdIH1cbiAgICAvLyAgICAgZmVhdHVyZV9kYXRhID0geyBJRCwgY2Fub25pY2FsLCBzeW1ib2wsIGNociwgc3RhcnQsIGVuZCwgc3RyYW5kLCB0eXBlLCBiaW90eXBlIH1cbiAgICAvL1xuICAgIC8vIEFnYWluLCBpbiBFbmdsaXNoOlxuICAgIC8vICAtIGRhdGEgaXMgYSBsaXN0IG9mIGl0ZW1zLCBvbmUgcGVyIHN0cmlwIHRvIGJlIGRpc3BsYXllZC4gSXRlbVswXSBpcyBkYXRhIGZvciB0aGUgcmVmIGdlbm9tZS5cbiAgICAvLyAgICBJdGVtc1sxK10gYXJlIGRhdGEgZm9yIHRoZSBjb21wYXJpc29uIGdlbm9tZS5cbiAgICAvLyAgLSBlYWNoIHN0cmlwIGl0ZW0gaXMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgYSBnZW5vbWUgYW5kIGEgbGlzdCBvZiBibG9ja3MuIEl0ZW1bMF0gYWx3YXlzIGhhcyBcbiAgICAvLyAgICBhIHNpbmdsZSBibG9jay5cbiAgICAvLyAgLSBlYWNoIGJsb2NrIGlzIGFuIG9iamVjdCBjb250YWluaW5nIGEgY2hyb21vc29tZSwgc3RhcnQsIGVuZCwgb3JpZW50YXRpb24sIGV0YywgYW5kIGEgbGlzdCBvZiBmZWF0dXJlcy5cbiAgICAvLyAgLSBlYWNoIGZlYXR1cmUgaGFzIGNocixzdGFydCxlbmQsc3RyYW5kLHR5cGUsYmlvdHlwZSxJRFxuICAgIC8vXG4gICAgLy8gQmVjYXVzZSBTQmxvY2tzIGNhbiBiZSB2ZXJ5IGZyYWdtZW50ZWQsIG9uZSBjb250aWd1b3VzIHJlZ2lvbiBpbiB0aGUgcmVmIGdlbm9tZSBjYW4gdHVybiBpbnRvIFxuICAgIC8vIGEgYmF6aWxsaW9uIHRpbnkgYmxvY2tzIGluIHRoZSBjb21wYXJpc29uLiBUaGUgcmVzdWx0aW5nIHJlbmRlcmluZyBpcyBqYXJyaW5nIGFuZCB1bnVzYWJsZS5cbiAgICAvLyBUaGUgZHJhd2luZyByb3V0aW5lIG1vZGlmaWVzIHRoZSBkYXRhIGJ5IG1lcmdpbmcgcnVucyBvZiBjb25zZWN1dGl2ZSBibG9ja3MgaW4gZWFjaCBjb21wIGdlbm9tZS5cbiAgICAvLyBUaGUgZGF0YSBjaGFuZ2UgaXMgdG8gaW5zZXJ0IGEgZ3JvdXBpbmcgbGF5ZXIgb24gdG9wIG9mIHRoZSBzYmxvY2tzLCBzcGVjaWZpY2FsbHksIFxuICAgIC8vICAgICB6b29tU3RyaXBfZGF0YSA9IHsgZ2Vub21lIFsgem9vbUJsb2NrX2RhdGEgXSB9XG4gICAgLy8gYmVjb21lc1xuICAgIC8vICAgICB6b29tU3RyaXBfZGF0YSA9IHsgZ2Vub21lIFsgem9vbVN1cGVyQmxvY2tfZGF0YSBdIH1cbiAgICAvLyAgICAgem9vbVN1cGVyQmxvY2tfZGF0YSA9IHsgY2hyIHN0YXJ0IGVuZCBibG9ja3MgWyB6b29tQmxvY2tfZGF0YSBdIH1cbiAgICAvL1xuICAgIG11bmdlRGF0YSAoZGF0YSkge1xuICAgICAgICBkYXRhLmZvckVhY2goZ0RhdGEgPT4ge1xuXHQgICAgZ0RhdGEuYmxvY2tzID0gdGhpcy51bmlxaWZ5QmxvY2tzKGdEYXRhLmJsb2Nrcylcblx0ICAgIC8vIEVhY2ggc3RyaXAgaXMgaW5kZXBlbmRlbnRseSBzY3JvbGxhYmxlLiBJbml0IGl0cyBvZmZzZXQgKGluIGJ5dGVzKS5cblx0ICAgIGdEYXRhLmRlbHRhQiA9IDA7XG5cdCAgICAvLyBFYWNoIHN0cmlwIGlzIGluZGVwZW5kZW50bHkgc2NhbGFibGUuIEluaXQgc2NhbGUuXG5cdCAgICBnRGF0YS54U2NhbGUgPSAxLjA7XG5cdH0pO1xuXHRkYXRhID0gdGhpcy5tZXJnZVNibG9ja1J1bnMoZGF0YSk7XG5cdC8vIFxuXHRkYXRhLmZvckVhY2goIGdEYXRhID0+IHtcblx0ICAvLyBtaW5pbXVtIG9mIDMgbGFuZXMgb24gZWFjaCBzaWRlXG5cdCAgZ0RhdGEubWF4TGFuZXNQID0gMztcblx0ICBnRGF0YS5tYXhMYW5lc04gPSAzO1xuXHQgIGdEYXRhLmJsb2Nrcy5mb3JFYWNoKCBzYj0+IHtcblx0ICAgIHNiLmZlYXR1cmVzLmZvckVhY2goZiA9PiB7XG5cdFx0aWYgKGYubGFuZSA+IDApXG5cdFx0ICAgIGdEYXRhLm1heExhbmVzUCA9IE1hdGgubWF4KGdEYXRhLm1heExhbmVzUCwgZi5sYW5lKVxuXHRcdGVsc2Vcblx0XHQgICAgZ0RhdGEubWF4TGFuZXNOID0gTWF0aC5tYXgoZ0RhdGEubWF4TGFuZXNOLCAtZi5sYW5lKVxuXHQgICAgfSk7XG5cdCAgfSk7XG5cdCAgaWYgKGdEYXRhLmJsb2Nrcy5sZW5ndGggPiAxKVxuXHQgICAgICBnRGF0YS5ibG9ja3MgPSBnRGF0YS5ibG9ja3MuZmlsdGVyKGI9PmIuZmVhdHVyZXMubGVuZ3RoID4gMCk7XG5cdCAgZ0RhdGEuc3RyaXBIZWlnaHQgPSAxNSArIHRoaXMuY2ZnLmxhbmVIZWlnaHQgKiAoZ0RhdGEubWF4TGFuZXNQICsgZ0RhdGEubWF4TGFuZXNOKTtcblx0ICBnRGF0YS56ZXJvT2Zmc2V0ID0gdGhpcy5jZmcubGFuZUhlaWdodCAqIGdEYXRhLm1heExhbmVzUDtcblx0fSk7XG5cdHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIE9yZGVycyBzYmxvY2tzIGhvcml6b250YWxseSB3aXRoaW4gZWFjaCBnZW5vbWUuIFRyYW5zbGF0ZXMgdGhlbSBpbnRvIHBvc2l0aW9uLlxuICAgIC8vXG4gICAgbGF5b3V0U0Jsb2NrcyAoc2Jsb2Nrcykge1xuXHQvLyBTb3J0IHRoZSBzYmxvY2tzIGluIGVhY2ggc3RyaXAgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IGRyYXdpbmcgbW9kZS5cblx0bGV0IGNtcEZpZWxkID0gdGhpcy5kbW9kZSA9PT0gJ2NvbXBhcmlzb24nID8gJ2luZGV4JyA6ICdmSW5kZXgnO1xuXHRsZXQgY21wRnVuYyA9IChhLGIpID0+IGEuX19kYXRhX19bY21wRmllbGRdLWIuX19kYXRhX19bY21wRmllbGRdO1xuXHRzYmxvY2tzLmZvckVhY2goIHN0cmlwID0+IHN0cmlwLnNvcnQoIGNtcEZ1bmMgKSApO1xuXHRsZXQgcHN0YXJ0ID0gW107IC8vIG9mZnNldCAoaW4gcGl4ZWxzKSBvZiBzdGFydCBwb3NpdGlvbiBvZiBuZXh0IGJsb2NrLCBieSBzdHJpcCBpbmRleCAoMD09PXJlZilcblx0bGV0IGJzdGFydCA9IFtdOyAvLyBibG9jayBzdGFydCBwb3MgKGluIGJwKSBhc3NvYyB3aXRoIHBzdGFydFxuXHRsZXQgY2NociA9IG51bGw7XG5cdGxldCBzZWxmID0gdGhpcztcblx0bGV0IEdBUCAgPSAxNjsgICAvLyBsZW5ndGggb2YgZ2FwIGJldHdlZW4gYmxvY2tzIG9mIGRpZmYgY2hyb21zLlxuXHRsZXQgZHg7XG5cdGxldCBwZW5kO1xuXHRzYmxvY2tzLmVhY2goIGZ1bmN0aW9uIChiLGksaikgeyAvLyBiPWJsb2NrLCBpPWluZGV4IHdpdGhpbiBzdHJpcCwgaj1zdHJpcCBpbmRleFxuXHQgICAgbGV0IGdkID0gdGhpcy5fX2RhdGFfXy5nZW5vbWU7XG5cdCAgICBsZXQgYmxlbiA9IHNlbGYucHBiICogKGIuZW5kIC0gYi5zdGFydCArIDEpOyAvLyB0b3RhbCBzY3JlZW4gd2lkdGggb2YgdGhpcyBzYmxvY2tcblx0ICAgIGIuZmxpcCA9IGIub3JpID09PSAnLScgJiYgc2VsZi5kbW9kZSA9PT0gJ3JlZmVyZW5jZSc7XG5cdCAgICBiLnhzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbYi5zdGFydCwgYi5lbmRdKS5yYW5nZSggYi5mbGlwID8gW2JsZW4sIDBdIDogWzAsIGJsZW5dICk7XG5cdCAgICAvL1xuXHQgICAgaWYgKGk9PT0wKSB7XG5cdFx0Ly8gZmlyc3QgYmxvY2sgaW4gZWFjaCBzdHJpcCBpbml0c1xuXHRcdHBzdGFydFtqXSA9IDA7XG5cdFx0Z2QucHdpZHRoID0gYmxlbjtcblx0XHRic3RhcnRbal0gPSBiLnN0YXJ0O1xuXHRcdGR4ID0gMDtcblx0XHRjY2hyID0gYi5jaHI7XG5cdCAgICB9XG5cdCAgICBlbHNlIHtcblx0XHRnZC5wd2lkdGggKz0gYmxlbjtcblx0XHRkeCA9IGIuY2hyID09PSBjY2hyID8gcHN0YXJ0W2pdICsgc2VsZi5wcGIgKiAoYi5zdGFydCAtIGJzdGFydFtqXSkgOiBJbmZpbml0eTtcblx0XHRpZiAoZHggPCAwIHx8IGR4ID4gc2VsZi5jZmcubWF4U0JnYXApIHtcblx0XHQgICAgLy8gQ2hhbmdlZCBjaHIgb3IganVtcGVkIGEgbGFyZ2UgZ2FwXG5cdFx0ICAgIHBzdGFydFtqXSA9IHBlbmQgKyBHQVA7XG5cdFx0ICAgIGJzdGFydFtqXSA9IGIuc3RhcnQ7XG5cdFx0ICAgIGdkLnB3aWR0aCArPSBHQVA7XG5cdFx0ICAgIGR4ID0gcHN0YXJ0W2pdO1xuXHRcdCAgICBjY2hyID0gYi5jaHI7XG5cdFx0fVxuXHQgICAgfVxuXHQgICAgcGVuZCA9IGR4ICsgYmxlbjtcblx0ICAgIGQzLnNlbGVjdCh0aGlzKS5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7ZHh9LDApYCk7XG5cdH0pO1xuXHR0aGlzLnNxdWlzaCgpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFNjYWxlcyBlYWNoIHpvb20gc3RyaXAgaG9yaXpvbnRhbGx5IHRvIGZpdCB0aGUgd2lkdGguIE9ubHkgc2NhbGVzIGRvd24uXG4gICAgc3F1aXNoICgpIHtcbiAgICAgICAgbGV0IHNicyA9IGQzLnNlbGVjdEFsbCgnLnpvb21TdHJpcCBbbmFtZT1cInNCbG9ja3NcIl0nKTtcblx0bGV0IHNlbGYgPSB0aGlzO1xuXHRzYnMuZWFjaChmdW5jdGlvbiAoc2IsaSkge1xuXHQgICAgaWYgKHNiLmdlbm9tZS5wd2lkdGggPiBzZWxmLndpZHRoKSB7XG5cdCAgICAgICAgbGV0IHMgPSBzZWxmLndpZHRoIC8gc2IuZ2Vub21lLnB3aWR0aDtcblx0XHRzYi54U2NhbGUgPSBzO1xuXHRcdGxldCB0ID0gZDMuc2VsZWN0KHRoaXMpO1xuXHRcdHQuYXR0cigndHJhbnNmb3JtJywgKCk9PiBgdHJhbnNsYXRlKCR7LXNiLmRlbHRhQiAqIHNlbGYucHBifSwwKXNjYWxlKCR7c2IueFNjYWxlfSwxKWApO1xuXHQgICAgfVxuXHR9KTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRHJhd3MgdGhlIHpvb20gdmlldyBwYW5lbCB3aXRoIHRoZSBnaXZlbiBkYXRhLlxuICAgIC8vXG4gICAgZHJhdyAoZGF0YSkge1xuXHQvL1xuXHR0aGlzLmRyYXdDb3VudCArPSAxO1xuXHQvLyBcblx0bGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICAvLyBJcyBab29tVmlldyBjdXJyZW50bHkgY2xvc2VkP1xuXHRsZXQgY2xvc2VkID0gdGhpcy5yb290LmNsYXNzZWQoJ2Nsb3NlZCcpO1xuXHQvLyBTaG93IHJlZiBnZW5vbWUgbmFtZVxuXHRkMy5zZWxlY3QoJyN6b29tVmlldyAuem9vbUNvb3JkcyBsYWJlbCcpXG5cdCAgICAudGV4dCh0aGlzLmFwcC5yR2Vub21lLmxhYmVsICsgJyBjb29yZHMnKTtcblx0Ly8gU2hvdyBsYW5kbWFyayBsYWJlbCwgaWYgYXBwbGljYWJsZVxuXHRsZXQgbG10eHQgPSAnJztcblx0aWYgKHRoaXMuY21vZGUgPT09ICdsYW5kbWFyaycpIHtcblx0ICAgIGxldCByZiA9IHRoaXMuYXBwLmxjb29yZHMubGFuZG1hcmtSZWZGZWF0O1xuXHQgICAgbGV0IGQgPSB0aGlzLmFwcC5sY29vcmRzLmRlbHRhO1xuXHQgICAgbGV0IGR0eHQgPSBkID8gYCAoJHtkID4gMCA/ICcrJyA6ICcnfSR7cHJldHR5UHJpbnRCYXNlcyhkKX0pYCA6ICcnO1xuXHQgICAgbG10eHQgPSBgQWxpZ25lZCBvbiAke3JmLnN5bWJvbCB8fCByZi5pZH0ke2R0eHR9YDtcblx0fVxuXHQvLyBkaXNhYmxlIHRoZSBSL0MgYnV0dG9uIGluIGxhbmRtYXJrIG1vZGVcblx0dGhpcy5yb290LnNlbGVjdEFsbCgnW25hbWU9XCJ6b29tY29udHJvbHNcIl0gW25hbWU9XCJ6b29tRG1vZGVcIl0gLmJ1dHRvbicpXG5cdCAgICAuYXR0cignZGlzYWJsZWQnLCB0aGlzLmNtb2RlID09PSAnbGFuZG1hcmsnIHx8IG51bGwpO1xuXHQvLyBkaXNwbGF5IGxhbmRtYXJrIHRleHRcblx0ZDMuc2VsZWN0KCcjem9vbVZpZXcgLnpvb21Db29yZHMgc3BhbicpLnRleHQoIGxtdHh0ICk7XG5cdFxuXHQvLyB0aGUgcmVmZXJlbmNlIGdlbm9tZSBibG9jayAoYWx3YXlzIGp1c3QgMSBvZiB0aGVzZSkuXG5cdGxldCByRGF0YSA9IGRhdGEuZmlsdGVyKGRkID0+IGRkLmdlbm9tZSA9PT0gdGhpcy5hcHAuckdlbm9tZSlbMF07XG5cdGxldCByQmxvY2sgPSByRGF0YS5ibG9ja3NbMF07XG5cblx0Ly8geC1zY2FsZSBhbmQgeC1heGlzIGJhc2VkIG9uIHRoZSByZWYgZ2Vub21lLlxuXHR0aGlzLnhzY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG5cdCAgICAuZG9tYWluKFtyQmxvY2suc3RhcnQsckJsb2NrLmVuZF0pXG5cdCAgICAucmFuZ2UoWzAsdGhpcy53aWR0aF0pO1xuXHQvL1xuXHQvLyBwaXhlbHMgcGVyIGJhc2Vcblx0dGhpcy5wcGIgPSB0aGlzLndpZHRoIC8gKHRoaXMuYXBwLmNvb3Jkcy5lbmQgLSB0aGlzLmFwcC5jb29yZHMuc3RhcnQgKyAxKTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLyBkcmF3IHRoZSBjb29yZGluYXRlIGF4aXNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0dGhpcy5heGlzRnVuYyA9IGQzLnN2Zy5heGlzKClcblx0ICAgIC5zY2FsZSh0aGlzLnhzY2FsZSlcblx0ICAgIC5vcmllbnQoJ3RvcCcpXG5cdCAgICAub3V0ZXJUaWNrU2l6ZSgyKVxuXHQgICAgLnRpY2tzKDUpXG5cdCAgICAudGlja1NpemUoNSlcblx0ICAgIDtcblx0dGhpcy5heGlzLmNhbGwodGhpcy5heGlzRnVuYyk7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gem9vbSBzdHJpcHMgKG9uZSBwZXIgZ2Vub21lKVxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBsZXQgenN0cmlwcyA9IHRoaXMuc3RyaXBzR3JwXG5cdCAgICAgICAgLnNlbGVjdEFsbCgnZy56b29tU3RyaXAnKVxuXHRcdC5kYXRhKGRhdGEsIGQgPT4gZC5nZW5vbWUubmFtZSk7XG5cdC8vIENyZWF0ZSB0aGUgZ3JvdXBcblx0bGV0IG5ld3pzID0genN0cmlwcy5lbnRlcigpXG5cdCAgICAgICAgLmFwcGVuZCgnZycpXG5cdFx0LmF0dHIoJ2NsYXNzJywnem9vbVN0cmlwJylcblx0XHQuYXR0cignbmFtZScsIGQgPT4gZC5nZW5vbWUubmFtZSlcblx0XHQub24oJ2NsaWNrJywgZnVuY3Rpb24gKGcpIHtcblx0XHQgICAgc2VsZi5oaWdobGlnaHRTdHJpcChnLmdlbm9tZSwgdGhpcyk7XG5cdFx0fSlcblx0XHQuY2FsbCh0aGlzLmRyYWdnZXIpXG5cdFx0O1xuXHQvL1xuXHQvLyBTdHJpcCBsYWJlbFxuXHRuZXd6cy5hcHBlbmQoJ3RleHQnKVxuXHQgICAgLmF0dHIoJ25hbWUnLCAnZ2Vub21lTGFiZWwnKVxuXHQgICAgLnRleHQoIGQgPT4gZC5nZW5vbWUubGFiZWwpXG5cdCAgICAuYXR0cigneCcsIDApXG5cdCAgICAuYXR0cigneScsIHRoaXMuY2ZnLmJsb2NrSGVpZ2h0LzIgKyAyMClcblx0ICAgIC5hdHRyKCdmb250LWZhbWlseScsJ3NhbnMtc2VyaWYnKVxuXHQgICAgLmF0dHIoJ2ZvbnQtc2l6ZScsIDEwKVxuXHQgICAgO1xuXHQvLyBTdHJpcCB1bmRlcmxheVxuXHRuZXd6cy5hcHBlbmQoJ3JlY3QnKVxuXHQgICAgLmF0dHIoJ2NsYXNzJywndW5kZXJsYXknKVxuXHQgICAgLnN0eWxlKCd3aWR0aCcsJzEwMCUnKVxuXHQgICAgLnN0eWxlKCdvcGFjaXR5JywwKVxuXHQgICAgO1xuXHQgICAgXG5cdC8vIEdyb3VwIGZvciBzQmxvY2tzXG5cdG5ld3pzLmFwcGVuZCgnZycpXG5cdCAgICAuYXR0cignbmFtZScsICdzQmxvY2tzJyk7XG5cdC8vIFN0cmlwIGVuZCBjYXBcblx0bmV3enMuYXBwZW5kKCdyZWN0Jylcblx0ICAgIC5hdHRyKCdjbGFzcycsICdtYXRlcmlhbC1pY29ucyB6b29tU3RyaXBFbmRDYXAnKVxuXHQgICAgLmF0dHIoJ3gnLCAtMTUpXG5cdCAgICAuYXR0cigneScsIC10aGlzLmNmZy5ibG9ja0hlaWdodCAvIDIpXG5cdCAgICAuYXR0cignd2lkdGgnLCAxNSlcblx0ICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmNmZy5ibG9ja0hlaWdodCArIDEwKVxuXHQgICAgO1xuXHQvLyBTdHJpcCBkcmFnLWhhbmRsZVxuXHRuZXd6cy5hcHBlbmQoJ3RleHQnKVxuXHQgICAgLmF0dHIoJ2NsYXNzJywgJ21hdGVyaWFsLWljb25zIHpvb21TdHJpcEhhbmRsZScpXG5cdCAgICAuc3R5bGUoJ2ZvbnQtc2l6ZScsICcxOHB4Jylcblx0ICAgIC5hdHRyKCd4JywgLTE1KVxuXHQgICAgLmF0dHIoJ3knLCA5KVxuXHQgICAgLnRleHQoJ2RyYWdfaW5kaWNhdG9yJylcblx0ICAgIC5hcHBlbmQoJ3RpdGxlJylcblx0ICAgICAgICAudGV4dCgnRHJhZyB1cC9kb3duIHRvIHJlb3JkZXIgdGhlIGdlbm9tZXMuJylcblx0ICAgIDtcblx0Ly8gVXBkYXRlc1xuXHR6c3RyaXBzLnNlbGVjdCgnLnpvb21TdHJpcEVuZENhcCcpXG5cdCAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5jZmcuYmxvY2tIZWlnaHQgKyAxMClcblx0ICAgIC5hdHRyKCd5JywgLXRoaXMuY2ZnLmJsb2NrSGVpZ2h0IC8gMilcblx0ICAgIDtcblx0enN0cmlwcy5zZWxlY3QoJ1tuYW1lPVwiZ2Vub21lTGFiZWxcIl0nKVxuXHQgICAgLmF0dHIoJ3knLCB0aGlzLmNmZy5ibG9ja0hlaWdodC8yICsgMjApXG5cdCAgICA7XG5cdHpzdHJpcHMuc2VsZWN0KCcudW5kZXJsYXknKVxuXHQgICAgLmF0dHIoJ3knLCAtdGhpcy5jZmcuYmxvY2tIZWlnaHQvMilcblx0ICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmNmZy5ibG9ja0hlaWdodClcblx0ICAgIDtcblx0ICAgIFxuXHQvLyB0cmFuc2xhdGUgc3RyaXBzIGludG8gcG9zaXRpb25cblx0bGV0IG9mZnNldCA9IHRoaXMuY2ZnLnRvcE9mZnNldDtcblx0bGV0IHJIZWlnaHQgPSAwO1xuXHR0aGlzLmFwcC52R2Vub21lcy5mb3JFYWNoKCB2ZyA9PiB7XG5cdCAgICBsZXQgcyA9IHRoaXMuc3RyaXBzR3JwLnNlbGVjdChgLnpvb21TdHJpcFtuYW1lPVwiJHt2Zy5uYW1lfVwiXWApO1xuXHQgICAgcy5jbGFzc2VkKCdyZWZlcmVuY2UnLCBkID0+IGQuZ2Vub21lID09PSB0aGlzLmFwcC5yR2Vub21lKVxuXHQgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBkID0+IHtcblx0XHQgICAgLy9yZXR1cm4gYHRyYW5zbGF0ZSgwLCR7Y2xvc2VkID8gdGhpcy5jZmcudG9wT2Zmc2V0IDogZy5nZW5vbWUuem9vbVl9KWBcblx0XHQgICAgaWYgKGQuZ2Vub21lID09PSB0aGlzLmFwcC5yR2Vub21lKVxuXHRcdCAgICAgICAgckhlaWdodCA9IGQuc3RyaXBIZWlnaHQgKyBkLnplcm9PZmZzZXQ7XG5cdFx0ICAgIGxldCBvID0gb2Zmc2V0ICsgZC56ZXJvT2Zmc2V0O1xuXHRcdCAgICBkLnpvb21ZID0gb2Zmc2V0O1xuXHRcdCAgICBvZmZzZXQgKz0gZC5zdHJpcEhlaWdodCArIHRoaXMuY2ZnLnN0cmlwR2FwO1xuXHRcdCAgICByZXR1cm4gYHRyYW5zbGF0ZSgwLCR7Y2xvc2VkID8gdGhpcy5jZmcudG9wT2Zmc2V0K2QuemVyb09mZnNldCA6IG99KWBcblx0XHR9KTtcblx0fSk7XG5cdC8vIHJlc2V0IHRoZSBzdmcgc2l6ZSBiYXNlZCBvbiBzdHJpcCB3aWR0aHNcblx0dGhpcy5zdmcuYXR0cignaGVpZ2h0JywgKGNsb3NlZCA/IHJIZWlnaHQgOiBvZmZzZXQpICsgMTUpO1xuXG4gICAgICAgIHpzdHJpcHMuZXhpdCgpXG5cdCAgICAub24oJy5kcmFnJywgbnVsbClcblx0ICAgIC5yZW1vdmUoKTtcblx0Ly9cbiAgICAgICAgenN0cmlwcy5zZWxlY3QoJ2dbbmFtZT1cInNCbG9ja3NcIl0nKVxuXHQgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGcgPT4gYHRyYW5zbGF0ZSgke2cuZGVsdGFCICogdGhpcy5wcGJ9LDApYClcblx0ICAgIDtcblx0Ly8gLS0tLSBTeW50ZW55IHN1cGVyIGJsb2NrcyAtLS0tXG4gICAgICAgIGxldCBzYmxvY2tzID0genN0cmlwcy5zZWxlY3QoJ1tuYW1lPVwic0Jsb2Nrc1wiXScpLnNlbGVjdEFsbCgnZy5zQmxvY2snKVxuXHQgICAgLmRhdGEoZD0+ZC5ibG9ja3MsIGIgPT4gYi5ibG9ja0lkKTtcblx0bGV0IG5ld3NicyA9IHNibG9ja3MuZW50ZXIoKVxuXHQgICAgLmFwcGVuZCgnZycpXG5cdCAgICAuYXR0cignY2xhc3MnLCAnc0Jsb2NrJylcblx0ICAgIC5hdHRyKCduYW1lJywgYj0+Yi5pbmRleClcblx0ICAgIDtcblx0bGV0IGwwID0gbmV3c2JzLmFwcGVuZCgnZycpLmF0dHIoJ25hbWUnLCAnbGF5ZXIwJyk7XG5cdGxldCBsMSA9IG5ld3Nicy5hcHBlbmQoJ2cnKS5hdHRyKCduYW1lJywgJ2xheWVyMScpO1xuXG5cdC8vXG5cdHRoaXMubGF5b3V0U0Jsb2NrcyhzYmxvY2tzKTtcblxuXHQvLyByZWN0YW5nbGUgZm9yIGVhY2ggaW5kaXZpZHVhbCBzeW50ZW55IGJsb2NrXG5cdGxldCBzYnJlY3RzID0gc2Jsb2Nrcy5zZWxlY3QoJ2dbbmFtZT1cImxheWVyMFwiXScpLnNlbGVjdEFsbCgncmVjdC5ibG9jaycpLmRhdGEoZD0+IHtcblx0ICAgIGQuc2Jsb2Nrcy5mb3JFYWNoKGI9PmIueHNjYWxlID0gZC54c2NhbGUpO1xuXHQgICAgcmV0dXJuIGQuc2Jsb2Nrc1xuXHQgICAgfSwgc2I9PnNiLmluZGV4KTtcbiAgICAgICAgc2JyZWN0cy5lbnRlcigpLmFwcGVuZCgncmVjdCcpLmFwcGVuZCgndGl0bGUnKTtcblx0c2JyZWN0cy5leGl0KCkucmVtb3ZlKCk7XG5cdHNicmVjdHNcblx0ICAgLmF0dHIoJ2NsYXNzJywgYiA9PiAnYmxvY2sgJyArIFxuXHQgICAgICAgKGIub3JpPT09JysnID8gJ3BsdXMnIDogYi5vcmk9PT0nLScgPyAnbWludXMnOiAnY29uZnVzZWQnKSArIFxuXHQgICAgICAgKGIuY2hyICE9PSBiLmZDaHIgPyAnIHRyYW5zbG9jYXRpb24nIDogJycpKVxuXHQgICAuYXR0cigneCcsICAgICBiID0+IGIueHNjYWxlKGIuZmxpcCA/IGIuZW5kIDogYi5zdGFydCkpXG5cdCAgIC5hdHRyKCd5JywgICAgIGIgPT4gLXRoaXMuY2ZnLmJsb2NrSGVpZ2h0IC8gMilcblx0ICAgLmF0dHIoJ3dpZHRoJywgYiA9PiBNYXRoLm1heCg0LCBNYXRoLmFicyhiLnhzY2FsZShiLmVuZCktYi54c2NhbGUoYi5zdGFydCkpKSlcblx0ICAgLmF0dHIoJ2hlaWdodCcsdGhpcy5jZmcuYmxvY2tIZWlnaHQpO1xuXHQgICA7XG5cdHNicmVjdHMuc2VsZWN0KCd0aXRsZScpXG5cdCAgIC50ZXh0KCBiID0+IHtcblx0ICAgICAgIGxldCBhZGplY3RpdmVzID0gW107XG5cdCAgICAgICBiLm9yaSA9PT0gJy0nICYmIGFkamVjdGl2ZXMucHVzaCgnaW52ZXJ0ZWQnKTtcblx0ICAgICAgIGIuY2hyICE9PSBiLmZDaHIgJiYgYWRqZWN0aXZlcy5wdXNoKCd0cmFuc2xvY2F0ZWQnKTtcblx0ICAgICAgIHJldHVybiBhZGplY3RpdmVzLmxlbmd0aCA/IGFkamVjdGl2ZXMuam9pbignLCAnKSArICcgYmxvY2snIDogJyc7XG5cdCAgIH0pO1xuXG5cdC8vIHRoZSBheGlzIGxpbmVcblx0bDAuYXBwZW5kKCdsaW5lJykuYXR0cignY2xhc3MnLCdheGlzJyk7XG5cdFxuXHRzYmxvY2tzLnNlbGVjdCgnbGluZS5heGlzJylcblx0ICAgIC5hdHRyKCd4MScsIGIgPT4gYi54c2NhbGUoYi5zdGFydCkpXG5cdCAgICAuYXR0cigneTEnLCAwKVxuXHQgICAgLmF0dHIoJ3gyJywgYiA9PiBiLnhzY2FsZShiLmVuZCkpXG5cdCAgICAuYXR0cigneTInLCAwKVxuXHQgICAgO1xuXHQvLyBsYWJlbFxuXHRsMC5hcHBlbmQoJ3RleHQnKVxuXHQgICAgLmF0dHIoJ2NsYXNzJywnYmxvY2tMYWJlbCcpIDtcblx0Ly8gYnJ1c2hcblx0bDAuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCdicnVzaCcpO1xuXHQvL1xuXHRzYmxvY2tzLmV4aXQoKS5yZW1vdmUoKTtcblxuXHQvLyBzeW50ZW55IGJsb2NrIGxhYmVsc1xuXHRzYmxvY2tzLnNlbGVjdCgndGV4dC5ibG9ja0xhYmVsJylcblx0ICAgIC50ZXh0KCBiID0+IGIuY2hyIClcblx0ICAgIC5hdHRyKCd4JywgYiA9PiAoYi54c2NhbGUoYi5zdGFydCkgKyBiLnhzY2FsZShiLmVuZCkpLzIgKVxuXHQgICAgLmF0dHIoJ3knLCB0aGlzLmNmZy5ibG9ja0hlaWdodCAvIDIgKyAxMClcblx0ICAgIDtcblxuXHQvLyBicnVzaFxuXHRzYmxvY2tzLnNlbGVjdCgnZy5icnVzaCcpXG5cdCAgICAuYXR0cigndHJhbnNmb3JtJywgYiA9PiBgdHJhbnNsYXRlKDAsJHt0aGlzLmNmZy5ibG9ja0hlaWdodCAvIDJ9KWApXG5cdCAgICAub24oJ21vdXNlbW92ZScsIGZ1bmN0aW9uKGIpIHtcblx0ICAgICAgICBsZXQgY3IgPSB0aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdGxldCB4ID0gZDMuZXZlbnQuY2xpZW50WCAtIGNyLng7XG5cdFx0bGV0IGMgPSBNYXRoLnJvdW5kKGIueHNjYWxlLmludmVydCh4KSk7XG5cdFx0c2VsZi5zaG93RmxvYXRpbmdUZXh0KGAke2IuY2hyfToke2N9YCwgZDMuZXZlbnQuY2xpZW50WCwgZDMuZXZlbnQuY2xpZW50WSk7XG5cdCAgICB9KVxuXHQgICAgLm9uKCdtb3VzZW91dCcsIGIgPT4gdGhpcy5oaWRlRmxvYXRpbmdUZXh0KCkpXG5cdCAgICAuZWFjaChmdW5jdGlvbihiKSB7XG5cdFx0aWYgKCFiLmJydXNoKSB7XG5cdFx0ICAgIGIuYnJ1c2ggPSBkMy5zdmcuYnJ1c2goKVxuXHRcdFx0Lm9uKCdicnVzaHN0YXJ0JywgZnVuY3Rpb24oKXsgc2VsZi5iYlN0YXJ0KCBiLCB0aGlzICk7IH0pXG5cdFx0XHQub24oJ2JydXNoJywgICAgICBmdW5jdGlvbigpeyBzZWxmLmJiQnJ1c2goIGIsIHRoaXMgKTsgfSlcblx0XHRcdC5vbignYnJ1c2hlbmQnLCAgIGZ1bmN0aW9uKCl7IHNlbGYuYmJFbmQoIGIsIHRoaXMgKTsgfSlcblx0XHR9XG5cdFx0Yi5icnVzaC54KGIueHNjYWxlKS5jbGVhcigpO1xuXHRcdGQzLnNlbGVjdCh0aGlzKS5jYWxsKGIuYnJ1c2gpO1xuXHQgICAgfSlcblx0ICAgIC5zZWxlY3RBbGwoJ3JlY3QnKVxuXHRcdC5hdHRyKCdoZWlnaHQnLCAxMCk7XG5cblx0dGhpcy5kcmF3RmVhdHVyZXMoc2Jsb2Nrcyk7XG5cblx0Ly9cblx0dGhpcy5hcHAuZmFjZXRNYW5hZ2VyLmFwcGx5QWxsKCk7XG5cblx0Ly8gV2UgbmVlZCB0byBsZXQgdGhlIHZpZXcgcmVuZGVyIGJlZm9yZSBkb2luZyB0aGUgaGlnaGxpZ2h0aW5nLCBzaW5jZSBpdCBkZXBlbmRzIG9uXG5cdC8vIHRoZSBwb3NpdGlvbnMgb2YgcmVjdGFuZ2xlcyBpbiB0aGUgc2NlbmUuXG5cdHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcblx0ICAgIHRoaXMuaGlnaGxpZ2h0KCk7XG5cdCAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0dGhpcy5oaWdobGlnaHQoKTtcblx0ICAgIH0sIDE1MCk7XG5cdH0sIDE1MCk7XG4gICAgfTtcblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIERyYXdzIHRoZSBmZWF0dXJlcyAocmVjdGFuZ2xlcykgZm9yIHRoZSBzcGVjaWZpZWQgc3ludGVueSBibG9ja3MuXG4gICAgLy8gQXJnczpcbiAgICAvLyAgICAgc2Jsb2NrcyAoRDMgc2VsZWN0aW9uIG9mIGcuc2Jsb2NrIG5vZGVzKSAtIG11bHRpbGV2ZWwgc2VsZWN0aW9uLlxuICAgIC8vICAgICAgICBBcnJheSAoY29ycmVzcG9uZGluZyB0byBzdHJpcHMpIG9mIGFycmF5cyBvZiBzeW50ZW55IGJsb2Nrcy5cbiAgICAvLyAgICAgZGV0YWlsZWQgKGJvb2xlYW4pIGlmIHRydWUsIGRyYXdzIGVhY2ggZmVhdHVyZSBpbiBmdWxsIGRldGFpbCAoaWUsXG4gICAgLy8gICAgICAgIHNob3cgZXhvbiBzdHJ1Y3R1cmUgaWYgYXZhaWxhYmxlKS4gT3RoZXJ3aXNlICh0aGUgZGVmYXVsdCksIGRyYXdcbiAgICAvLyAgICAgICAgZWFjaCBmZWF0dXJlIGFzIGp1c3QgYSByZWN0YW5nbGUuXG4gICAgLy9cbiAgICBkcmF3RmVhdHVyZXMgKHNibG9ja3MpIHtcblx0Ly8gYmVmb3JlIGRvaW5nIGFueXRoaW5nIGVsc2UuLi5cblx0aWYgKHRoaXMuY2xlYXJBbGwpIHtcblx0ICAgIC8vIGlmIHdlIGFyZSBjaGFuZ2luZyBiZXR3ZWVuIGRldGFpbGVkIGFuZCBzaW1wbGUgZmVhdHVyZXMsIGhhdmUgdG8gZGVsZXRlIGV4aXN0aW5nIHJlbmRlcmVkIGZlYXR1cmVzIGZpcnN0XG5cdCAgICAvLyBiZWNhdXNlIHRoZSBzdHJ1Y3R1cmVzIGFyZSBpbmNvbXBhdGlibGUuIFVnaC4gXG5cdCAgICBzYmxvY2tzLnNlbGVjdEFsbCgnLmZlYXR1cmUnKS5yZW1vdmUoKTtcblx0fVxuXHQvLyBvaywgbm93IHRoYXQncyB0YWtlbiBjYXJlIG9mLi4uXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcblx0Ly9cblx0Ly8gbmV2ZXIgZHJhdyB0aGUgc2FtZSBmZWF0dXJlIHR3aWNlIGluIG9uZSByZW5kZXJpbmcgcGFzc1xuXHQvLyBDYW4gaGFwcGVuIGluIGNvbXBsZXggc2Jsb2NrcyB3aGVyZSB0aGUgcmVsYXRpb25zaGlwIGluIG5vdCAxOjFcblx0bGV0IGRyYXduID0gbmV3IFNldCgpO1x0Ly8gc2V0IG9mIElEcyBvZiBkcmF3biBmZWF0dXJlc1xuXHRsZXQgZmlsdGVyRHJhd24gPSBmdW5jdGlvbiAoZikge1xuXHQgICAgLy8gcmV0dXJucyB0cnVlIGlmIHdlJ3ZlIG5vdCBzZWVuIHRoaXMgb25lIGJlZm9yZS5cblx0ICAgIC8vIHJlZ2lzdGVycyB0aGF0IHdlJ3ZlIHNlZW4gaXQuXG5cdCAgICBsZXQgZmlkID0gZi5JRDtcblx0ICAgIGxldCB2ID0gISBkcmF3bi5oYXMoZmlkKTtcblx0ICAgIGRyYXduLmFkZChmaWQpO1xuXHQgICAgcmV0dXJuIHY7XG5cdH07XG5cdC8vXG5cdGxldCBmZWF0cyA9IHNibG9ja3Muc2VsZWN0KCdbbmFtZT1cImxheWVyMVwiXScpLnNlbGVjdEFsbCgnLmZlYXR1cmUnKVxuXHQgICAgLmRhdGEoZD0+ZC5mZWF0dXJlcy5maWx0ZXIoZmlsdGVyRHJhd24pLCBkPT5kLklEKTtcblx0ZmVhdHMuZXhpdCgpLnJlbW92ZSgpO1xuXHQvL1xuXHRsZXQgbmV3RmVhdHM7XG5cdGlmICh0aGlzLnNob3dGZWF0dXJlRGV0YWlscykge1xuXHQgICAgLy8gZHJhdyBkZXRhaWxlZCBmZWF0dXJlc1xuXHQgICAgbmV3RmVhdHMgPSBmZWF0cy5lbnRlcigpLmFwcGVuZCgnZycpXG5cdFx0LmF0dHIoJ2NsYXNzJywgZiA9PiAnZmVhdHVyZSBkZXRhaWxlZCAnICsgKGYuc3RyYW5kPT09Jy0nID8gJyBtaW51cycgOiAnIHBsdXMnKSlcblx0XHQuYXR0cignbmFtZScsIGYgPT4gZi5JRClcblx0XHQ7XG5cdCAgICBuZXdGZWF0cy5hcHBlbmQoJ3JlY3QnKVxuXHRcdC5zdHlsZSgnZmlsbCcsIGYgPT4gc2VsZi5hcHAuY3NjYWxlKGYuZ2V0TXVuZ2VkVHlwZSgpKSlcblx0XHQ7XG5cdCAgICBuZXdGZWF0cy5hcHBlbmQoJ2cnKVxuXHQgICAgICAgIC5hdHRyKCdjbGFzcycsJ3RyYW5zY3JpcHRzJylcblx0XHQuYXR0cigndHJhbnNmb3JtJywndHJhbnNsYXRlKDAsMCknKVxuXHRcdDtcblx0fVxuXHRlbHNlIHtcblx0ICAgIC8vIHNpbXBsZXN0IHN0eWxlOiBkcmF3IGZlYXR1cmVzIGFzIGp1c3QgYSByZWN0YW5nbGVcblx0ICAgIG5ld0ZlYXRzID0gZmVhdHMuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuXHRcdC5hdHRyKCdjbGFzcycsIGYgPT4gJ2ZlYXR1cmUnICsgKGYuc3RyYW5kPT09Jy0nID8gJyBtaW51cycgOiAnIHBsdXMnKSlcblx0XHQuYXR0cignbmFtZScsIGYgPT4gZi5JRClcblx0XHQuc3R5bGUoJ2ZpbGwnLCBmID0+IHNlbGYuYXBwLmNzY2FsZShmLmdldE11bmdlZFR5cGUoKSkpXG5cdFx0O1xuXHR9XG5cdC8vIE5COiBpZiB5b3UgYXJlIGxvb2tpbmcgZm9yIGNsaWNrIGhhbmRsZXJzLCB0aGV5IGFyZSBhdCB0aGUgc3ZnIGxldmVsIChzZWUgaW5pdERvbSBhYm92ZSkuXG5cblx0Ly8gcmV0dXJucyB0aGUgc3ludGVueSBibG9jayBjb250YWluaW5nIHRoaXMgZmVhdHVyZVxuXHRsZXQgZkJsb2NrID0gZnVuY3Rpb24gKGZlYXRFbHQpIHtcblx0ICAgIGxldCBibGtFbHQgPSBmZWF0RWx0LmNsb3Nlc3QoJy5zQmxvY2snKTtcblx0ICAgIHJldHVybiBibGtFbHQuX19kYXRhX187XG5cdH1cblx0Ly8gU2V0cyBhbmQgcmV0dXJucyB0aGUgc2NlbmUgeCBjb29yZGluYXRlIGZvciB0aGUgZ2l2ZW4gZmVhdHVyZS5cblx0bGV0IGZ4ID0gZnVuY3Rpb24oZikge1xuXHQgICAgbGV0IGIgPSBmQmxvY2sodGhpcyk7XG5cdCAgICBsZXQgeCA9IGIueHNjYWxlKE1hdGgubWF4KGYuc3RhcnQsYi5zdGFydCkpXG5cdCAgICBmLnggPSB4O1xuXHQgICAgcmV0dXJuIHg7XG5cdH07XG5cdC8vIFNldHMgYW5kIHJldHVybnMgdGhlIHNjZW5lIHdpZHRoIGZvciB0aGUgZ2l2ZW4gZmVhdHVyZS5cblx0bGV0IGZ3ID0gZnVuY3Rpb24gKGYpIHtcblx0ICAgIGxldCBiID0gZkJsb2NrKHRoaXMpO1xuXHQgICAgaWYgKGYuZW5kIDwgYi5zdGFydCB8fCBmLnN0YXJ0ID4gYi5lbmQpIHJldHVybiAwO1xuXHQgICAgbGV0IHdpZHRoID0gTWF0aC5hYnMoYi54c2NhbGUoTWF0aC5taW4oZi5lbmQsYi5lbmQpKSAtIGIueHNjYWxlKE1hdGgubWF4KGYuc3RhcnQsYi5zdGFydCkpKSArIDE7XG5cdCAgICBmLndpZHRoID0gd2lkdGg7XG5cdCAgICByZXR1cm4gd2lkdGg7XG5cdH07XG5cdC8vIFNldHMgYW5kIHJldHVybnMgdGhlIHNjZW5lIHkgY29vcmRpbmF0ZSAocHgpIGZvciB0aGUgZ2l2ZW4gZmVhdHVyZS5cblx0bGV0IGZ5ID0gZnVuY3Rpb24gKGYpIHtcblx0ICAgICAgIGxldCBiID0gZkJsb2NrKHRoaXMpO1xuXHQgICAgICAgbGV0IHk7XG5cdCAgICAgICBpZiAoZi5zdHJhbmQgPT09ICcrJyl7XG5cdFx0ICAgaWYgKGIuZmxpcCkgXG5cdFx0ICAgICAgIHkgPSBzZWxmLmNmZy5sYW5lSGVpZ2h0KmYubGFuZSAtIHNlbGYuY2ZnLmZlYXRIZWlnaHQ7IFxuXHRcdCAgIGVsc2UgXG5cdFx0ICAgICAgIHkgPSAtc2VsZi5jZmcubGFuZUhlaWdodCpmLmxhbmU7XG5cdCAgICAgICB9XG5cdCAgICAgICBlbHNlIHtcblx0XHQgICAvLyBmLmxhbmUgaXMgbmVnYXRpdmUgZm9yICctJyBzdHJhbmRcblx0XHQgICBpZiAoYi5mbGlwKSBcblx0XHQgICAgICAgeSA9IHNlbGYuY2ZnLmxhbmVIZWlnaHQqZi5sYW5lO1xuXHRcdCAgIGVsc2Vcblx0XHQgICAgICAgeSA9IC1zZWxmLmNmZy5sYW5lSGVpZ2h0KmYubGFuZSAtIHNlbGYuY2ZnLmZlYXRIZWlnaHQ7IFxuXHQgICAgICAgfVxuXHQgICAgICAgZi55ID0geTtcblx0ICAgICAgIHJldHVybiB5O1xuXHQgICB9O1xuXG5cdC8vIFNldCBwb3NpdGlvbiBhbmQgc2l6ZSBhdHRyaWJ1dGVzIG9mIHRoZSBvdmVyYWxsIGZlYXR1cmUgcmVjdC5cblx0KHRoaXMuc2hvd0ZlYXR1cmVEZXRhaWxzID8gZmVhdHMuc2VsZWN0KCdyZWN0JykgOiBmZWF0cylcblx0ICAuYXR0cigneCcsIGZ4KVxuXHQgIC5hdHRyKCd5JywgZnkpXG5cdCAgLmF0dHIoJ3dpZHRoJywgZncpXG5cdCAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuY2ZnLmZlYXRIZWlnaHQpXG5cdCAgO1xuXG5cdC8vIGRyYXcgZGV0YWlsZWQgZmVhdHVyZVxuXHRpZiAodGhpcy5zaG93RmVhdHVyZURldGFpbHMpIHtcblx0ICAgIC8vIGRyYXcgdHJhbnNjcmlwdHNcblx0ICAgIGxldCB0Z3JwcyA9IGZlYXRzLnNlbGVjdCgnZy50cmFuc2NyaXB0cycpO1xuXHQgICAgbGV0IHRyYW5zY3JpcHRzID0gdGdycHMuc2VsZWN0QWxsKCcudHJhbnNjcmlwdCcpXG5cdCAgICAgICAgLmRhdGEoIGYgPT4gZi50cmFuc2NyaXB0cywgdCA9PiB0LklEIClcblx0XHQ7XG5cdCAgICBsZXQgbmV3dHMgPSB0cmFuc2NyaXB0cy5lbnRlcigpLmFwcGVuZCgnZycpXG5cdCAgICAgICAgLmF0dHIoJ2NsYXNzJywndHJhbnNjcmlwdCcpXG5cdFx0O1xuXHQgICAgbmV3dHMuYXBwZW5kKCdsaW5lJyk7XG5cdCAgICBuZXd0cy5hcHBlbmQoJ3JlY3QnKTtcblx0ICAgIG5ld3RzLmFwcGVuZCgnZycpXG5cdCAgICAgICAgLmF0dHIoJ2NsYXNzJywnZXhvbnMnKVxuXHRcdDtcblx0ICAgIHRyYW5zY3JpcHRzLmV4aXQoKS5yZW1vdmUoKTtcblx0ICAgIC8vIGRyYXcgdHJhbnNjcmlwdCBheGlzIGxpbmVzXG5cdCAgICB0cmFuc2NyaXB0cy5zZWxlY3QoJ2xpbmUnKVxuXHQgICAgICAgIC5hdHRyKCd4MScsIGZ4KVxuXHRcdC5hdHRyKCd5MScsIGZ1bmN0aW9uKHQpIHtyZXR1cm4gZnkuYmluZCh0aGlzKSh0LmZlYXR1cmUpfSlcblx0XHQuYXR0cigneDInLCBmdW5jdGlvbiAodCkgeyByZXR1cm4gZnguYmluZCh0aGlzKSh0KSArIGZ3LmJpbmQodGhpcykodCkgLSAxIH0pXG5cdFx0LmF0dHIoJ3kyJywgZnVuY3Rpb24odCkge3JldHVybiBmeS5iaW5kKHRoaXMpKHQuZmVhdHVyZSl9KVxuXHRcdC5hdHRyKCd0cmFuc2Zvcm0nLGB0cmFuc2xhdGUoMCwke3RoaXMuY2ZnLmZlYXRIZWlnaHQvMn0pYClcblx0XHQuYXR0cignc3Ryb2tlJywgdCA9PiB0aGlzLmFwcC5jc2NhbGUodC5mZWF0dXJlLmdldE11bmdlZFR5cGUoKSkpXG5cdFx0O1xuXHQgICAgdHJhbnNjcmlwdHMuc2VsZWN0KCdyZWN0Jylcblx0XHQuYXR0cigneCcsIGZ4KVxuXHRcdC5hdHRyKCd5JywgZnVuY3Rpb24odCkge3JldHVybiBmeS5iaW5kKHRoaXMpKHQuZmVhdHVyZSl9KVxuXHRcdC5hdHRyKCd3aWR0aCcsIGZ3KVxuXHRcdC5hdHRyKCdoZWlnaHQnLCB0aGlzLmNmZy5mZWF0SGVpZ2h0KVxuXHRcdC5zdHlsZSgnZmlsbCcsIHQgPT4gdGhpcy5hcHAuY3NjYWxlKHQuZmVhdHVyZS5nZXRNdW5nZWRUeXBlKCkpKVxuXHRcdC5zdHlsZSgnZmlsbC1vcGFjaXR5JywgMClcblx0XHQ7XG5cblx0ICAgIGxldCBlZ3JwcyA9IHRyYW5zY3JpcHRzLnNlbGVjdCgnZy5leG9ucycpO1xuXHQgICAgbGV0IGV4b25zID0gZWdycHMuc2VsZWN0QWxsKCcuZXhvbicpXG5cdFx0LmRhdGEoZiA9PiBmLmV4b25zIHx8IFtdLCBlID0+IGUuSUQpXG5cdFx0O1xuXHQgICAgZXhvbnMuZW50ZXIoKS5hcHBlbmQoJ3JlY3QnKVxuXHRcdC5hdHRyKCdjbGFzcycsJ2V4b24nKVxuXHRcdC5zdHlsZSgnZmlsbCcsIGUgPT4gdGhpcy5hcHAuY3NjYWxlKGUuZmVhdHVyZS5nZXRNdW5nZWRUeXBlKCkpKVxuXHRcdC5hcHBlbmQoJ3RpdGxlJylcblx0XHQgICAgLnRleHQoZSA9PiAnZXhvbjogJytlLklEKVxuXHRcdCAgICA7XG5cdCAgICBleG9ucy5leGl0KCkucmVtb3ZlKCk7XG5cdCAgICBleG9ucy5hdHRyKCduYW1lJywgZSA9PiBlLnByaW1hcnlJZGVudGlmaWVyKVxuXHQgICAgICAgIC5hdHRyKCd4JywgZngpXG5cdCAgICAgICAgLmF0dHIoJ3knLCBmdW5jdGlvbihlKSB7cmV0dXJuIGZ5LmJpbmQodGhpcykoZS5mZWF0dXJlKX0pXG5cdCAgICAgICAgLmF0dHIoJ3dpZHRoJywgZncpXG5cdCAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuY2ZnLmZlYXRIZWlnaHQpXG5cdFx0O1xuXHQgICAgLy9cblx0ICAgIHRoaXMuc3ByZWFkVHJhbnNjcmlwdHMgPSB0aGlzLnNwcmVhZFRyYW5zY3JpcHRzOyBcblx0fVxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFVwZGF0ZXMgZmVhdHVyZSBoaWdobGlnaHRpbmcgaW4gdGhlIGN1cnJlbnQgem9vbSB2aWV3LlxuICAgIC8vIEZlYXR1cmVzIHRvIGJlIGhpZ2hsaWdodGVkIGluY2x1ZGUgdGhvc2UgaW4gdGhlIGhpRmVhdHMgbGlzdCBwbHVzIHRoZSBmZWF0dXJlXG4gICAgLy8gY29ycmVzcG9uZGluZyB0byB0aGUgcmVjdGFuZ2xlIGFyZ3VtZW50LCBpZiBnaXZlbi4gKFRoZSBtb3VzZW92ZXIgZmVhdHVyZS4pXG4gICAgLy9cbiAgICAvLyBEcmF3cyBmaWR1Y2lhbHMgZm9yIGZlYXR1cmVzIGluIHRoaXMgbGlzdCB0aGF0OlxuICAgIC8vIDEuIG92ZXJsYXAgdGhlIGN1cnJlbnQgem9vbVZpZXcgY29vcmQgcmFuZ2VcbiAgICAvLyAyLiBhcmUgbm90IHJlbmRlcmVkIGludmlzaWJsZSBieSBjdXJyZW50IGZhY2V0IHNldHRpbmdzXG4gICAgLy9cbiAgICAvLyBBcmdzOlxuICAgIC8vICAgIGN1cnJlbnQgKHJlY3QgZWxlbWVudCkgT3B0aW9uYWwuIEFkZCdsIHJlY3RhbmdsZSBlbGVtZW50LCBlLmcuLCB0aGF0IHdhcyBtb3VzZWQtb3Zlci4gSGlnaGxpZ2h0aW5nXG4gICAgLy8gICAgICAgIHdpbGwgaW5jbHVkZSB0aGUgZmVhdHVyZSBjb3JyZXNwb25kaW5nIHRvIHRoaXMgcmVjdCBhbG9uZyB3aXRoIHRob3NlIGluIHRoZSBoaWdobGlnaHQgbGlzdC5cbiAgICAvLyAgICBwdWxzZUN1cnJlbnQgKGJvb2xlYW4pIElmIHRydWUgYW5kIGN1cnJlbnQgaXMgZ2l2ZW4sIGNhdXNlIGl0IHRvIHB1bHNlIGJyaWVmbHkuXG4gICAgLy9cbiAgICBoaWdobGlnaHQgKGN1cnJlbnQsIHB1bHNlQ3VycmVudCkge1xuXHRsZXQgc2VsZiA9IHRoaXM7XG5cdC8vIGN1cnJlbnQgZmVhdHVyZVxuXHRsZXQgY3VyckZlYXQgPSBjdXJyZW50ID8gKGN1cnJlbnQgaW5zdGFuY2VvZiBGZWF0dXJlID8gY3VycmVudCA6IGN1cnJlbnQuX19kYXRhX18pIDogbnVsbDtcblx0Ly8gY3JlYXRlIGxvY2FsIGNvcHkgb2YgaGlGZWF0cywgd2l0aCBjdXJyZW50IGZlYXR1cmUgYWRkZWRcblx0bGV0IGhpRmVhdHMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmhpRmVhdHMsIHRoaXMuYXBwLmN1cnJMaXN0SW5kZXggfHx7fSk7XG5cdGlmIChjdXJyRmVhdCkge1xuXHQgICAgaGlGZWF0c1tjdXJyRmVhdC5pZF0gPSBjdXJyRmVhdC5pZDtcblx0fVxuXG5cdC8vIEZpbHRlciBhbGwgZmVhdHVyZXMgKHJlY3RhbmdsZXMpIGluIHRoZSBzY2VuZSBmb3IgdGhvc2UgYmVpbmcgaGlnaGxpZ2h0ZWQuXG5cdC8vIEFsb25nIHRoZSB3YXksIGJ1aWxkIGluZGV4IG1hcHBpbmcgZmVhdHVyZSBpZCB0byBpdHMgJ3N0YWNrJyBvZiBlcXVpdmFsZW50IGZlYXR1cmVzLFxuXHQvLyBpLmUuIGEgbGlzdCBvZiBpdHMgZ2Vub2xvZ3Mgc29ydGVkIGJ5IHkgY29vcmRpbmF0ZS5cblx0Ly9cblx0dGhpcy5zdGFja3MgPSB7fTsgLy8gZmlkIC0+IFsgcmVjdHMgXSBcblx0bGV0IGRoID0gdGhpcy5jZmcuYmxvY2tIZWlnaHQvMiAtIHRoaXMuY2ZnLmZlYXRIZWlnaHQ7XG4gICAgICAgIGxldCBmZWF0cyA9IHRoaXMuc3ZnTWFpbi5zZWxlY3RBbGwoJy5mZWF0dXJlJylcblx0ICAvLyBmaWx0ZXIgcmVjdC5mZWF0dXJlcyBmb3IgdGhvc2UgaW4gdGhlIGhpZ2hsaWdodCBsaXN0XG5cdCAgLmZpbHRlcihmdW5jdGlvbihmZil7XG5cdCAgICAgIC8vIGhpZ2hsaWdodCBmZiBpZiBlaXRoZXIgaWQgaXMgaW4gdGhlIGxpc3QgQU5EIGl0J3Mgbm90IGJlZW4gaGlkZGVuXG5cdCAgICAgIGxldCBtZ2kgPSBoaUZlYXRzW2ZmLmNhbm9uaWNhbF07XG5cdCAgICAgIGxldCBtZ3AgPSBoaUZlYXRzW2ZmLklEXTtcblx0ICAgICAgbGV0IHNob3dpbmcgPSBkMy5zZWxlY3QodGhpcykuc3R5bGUoJ2Rpc3BsYXknKSAhPT0gJ25vbmUnO1xuXHQgICAgICBsZXQgaGwgPSBzaG93aW5nICYmIChtZ2kgfHwgbWdwKTtcblx0ICAgICAgaWYgKGhsKSB7XG5cdFx0ICAvLyBmb3IgZWFjaCBoaWdobGlnaHRlZCBmZWF0dXJlLCBhZGQgaXRzIHJlY3RhbmdsZSB0byB0aGUgbGlzdFxuXHRcdCAgbGV0IGsgPSBmZi5pZDtcblx0XHQgIGlmICghc2VsZi5zdGFja3Nba10pIHNlbGYuc3RhY2tzW2tdID0gW11cblx0XHQgIC8vIGlmIHNob3dpbmcgZmVhdHVyZSBkZXRhaWxzLCAuZmVhdHVyZSBpcyBhIGdyb3VwIHdpdGggdGhlIHJlY3QgYXMgdGhlIDFzdCBjaGlsZC5cblx0XHQgIC8vIG90aGVyd2lzZSwgLmZlYXR1cmUgaXMgdGhlIHJlY3QgaXRzZWxmLlxuXHRcdCAgc2VsZi5zdGFja3Nba10ucHVzaCh0aGlzLnRhZ05hbWUgPT09ICdnJyA/IHRoaXMuY2hpbGROb2Rlc1swXSA6IHRoaXMpXG5cdCAgICAgIH1cblx0ICAgICAgLy8gXG5cdCAgICAgIGQzLnNlbGVjdCh0aGlzKVxuXHRcdCAgLmNsYXNzZWQoJ2hpZ2hsaWdodCcsIGhsKVxuXHRcdCAgLmNsYXNzZWQoJ2N1cnJlbnQnLCBobCAmJiBjdXJyRmVhdCAmJiB0aGlzLl9fZGF0YV9fLmlkID09PSBjdXJyRmVhdC5pZClcblx0XHQgIC5jbGFzc2VkKCdleHRyYScsIHB1bHNlQ3VycmVudCAmJiBmZiA9PT0gY3VyckZlYXQpXG5cdCAgICAgIHJldHVybiBobDtcblx0ICB9KVxuXHQgIDtcblxuXHR0aGlzLmRyYXdGaWR1Y2lhbHMoY3VyckZlYXQpO1xuXG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRHJhd3MgcG9seWdvbnMgdGhhdCBjb25uZWN0IGhpZ2hsaWdodGVkIGZlYXR1cmVzIGluIHRoZSB2aWV3XG4gICAgLy9cbiAgICBkcmF3RmlkdWNpYWxzIChjdXJyRmVhdCkge1xuXHQvLyBidWlsZCBkYXRhIGFycmF5IGZvciBkcmF3aW5nIGZpZHVjaWFscyBiZXR3ZWVuIGVxdWl2YWxlbnQgZmVhdHVyZXNcblx0bGV0IGRhdGEgPSBbXTtcblx0Zm9yIChsZXQgayBpbiB0aGlzLnN0YWNrcykge1xuXHQgICAgLy8gZm9yIGVhY2ggaGlnaGxpZ2h0ZWQgZmVhdHVyZSwgc29ydCB0aGUgcmVjdGFuZ2xlcyBpbiBpdHMgbGlzdCBieSBZLWNvb3JkaW5hdGVcblx0ICAgIGxldCByZWN0cyA9IHRoaXMuc3RhY2tzW2tdO1xuXHQgICAgcmVjdHMuc29ydCggKGEsYikgPT4gcGFyc2VGbG9hdChhLmdldEF0dHJpYnV0ZSgneScpKSAtIHBhcnNlRmxvYXQoYi5nZXRBdHRyaWJ1dGUoJ3knKSkgKTtcblx0ICAgIHJlY3RzLnNvcnQoIChhLGIpID0+IHtcblx0XHRyZXR1cm4gYS5fX2RhdGFfXy5nZW5vbWUuem9vbVkgLSBiLl9fZGF0YV9fLmdlbm9tZS56b29tWTtcblx0ICAgIH0pO1xuXHQgICAgLy8gV2FudCBhIHBvbHlnb24gYmV0d2VlbiBlYWNoIHN1Y2Nlc3NpdmUgcGFpciBvZiBpdGVtcy4gVGhlIGZvbGxvd2luZyBjcmVhdGVzIGEgbGlzdCBvZlxuXHQgICAgLy8gbiBwYWlycywgd2hlcmUgcmVjdFtpXSBpcyBwYWlyZWQgd2l0aCByZWN0W2krMV0uIFRoZSBsYXN0IHBhaXIgY29uc2lzdHMgb2YgdGhlIGxhc3Rcblx0ICAgIC8vIHJlY3RhbmdsZSBwYWlyZWQgd2l0aCB1bmRlZmluZWQuIChXZSB3YW50IHRoaXMuKVxuXHQgICAgbGV0IHBhaXJzID0gcmVjdHMubWFwKChyLCBpKSA9PiBbcixyZWN0c1tpKzFdXSk7XG5cdCAgICAvLyBBZGQgYSBjbGFzcyAoJ2N1cnJlbnQnKSBmb3IgdGhlIHBvbHlnb25zIGFzc29jaWF0ZWQgd2l0aCB0aGUgbW91c2VvdmVyIGZlYXR1cmUgc28gdGhleVxuXHQgICAgLy8gY2FuIGJlIGRpc3Rpbmd1aXNoZWQgZnJvbSBvdGhlcnMuXG5cdCAgICBkYXRhLnB1c2goeyBmaWQ6IGssIHJlY3RzOiBwYWlycywgY2xzOiAoY3VyckZlYXQgJiYgY3VyckZlYXQuaWQgPT09IGsgPyAnY3VycmVudCcgOiAnJykgfSk7XG5cdH1cblxuXHRsZXQgc2VsZiA9IHRoaXM7XG5cdC8vXG5cdC8vIHB1dCBmaWR1Y2lhbCBtYXJrcyBpbiB0aGVpciBvd24gZ3JvdXAgXG5cdGxldCBmR3JwID0gdGhpcy5maWR1Y2lhbHMuY2xhc3NlZCgnaGlkZGVuJywgZmFsc2UpO1xuXG5cdC8vIEJpbmQgZmlyc3QgbGV2ZWwgZGF0YSB0byAnZmVhdHVyZU1hcmtzJyBncm91cHNcblx0bGV0IGZmR3JwcyA9IGZHcnAuc2VsZWN0QWxsKCdnLmZlYXR1cmVNYXJrcycpXG5cdCAgICAuZGF0YShkYXRhLCBkID0+IGQuZmlkKTtcblx0ZmZHcnBzLmVudGVyKCkuYXBwZW5kKCdnJylcblx0ICAgIC5hdHRyKCduYW1lJywgZCA9PiBkLmZpZCk7XG5cdGZmR3Jwcy5leGl0KCkucmVtb3ZlKCk7XG5cdC8vXG5cdGZmR3Jwcy5hdHRyKCdjbGFzcycsIGQgPT4ge1xuICAgICAgICAgICAgbGV0IGNsYXNzZXMgPSBbJ2ZlYXR1cmVNYXJrcyddO1xuXHQgICAgZC5jbHMgJiYgY2xhc3Nlcy5wdXNoKGQuY2xzKTtcblx0ICAgIHRoaXMuYXBwLmN1cnJMaXN0SW5kZXhbZC5maWRdICYmIGNsYXNzZXMucHVzaCgnbGlzdEl0ZW0nKVxuXHQgICAgcmV0dXJuIGNsYXNzZXMuam9pbignICcpO1xuXHR9KTtcblxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdC8vIERyYXcgdGhlIGNvbm5lY3RvciBwb2x5Z29ucy5cblx0Ly8gQmluZCBzZWNvbmQgbGV2ZWwgZGF0YSAocmVjdGFuZ2xlIHBhaXJzKSB0byBwb2x5Z29ucyBpbiB0aGUgZ3JvdXBcblx0bGV0IHBnb25zID0gZmZHcnBzLnNlbGVjdEFsbCgncG9seWdvbicpXG5cdCAgICAuZGF0YShkPT5kLnJlY3RzLmZpbHRlcihyID0+IHJbMF0gJiYgclsxXSkpO1xuXHRwZ29ucy5lbnRlcigpLmFwcGVuZCgncG9seWdvbicpXG5cdCAgICAuYXR0cignY2xhc3MnLCdmaWR1Y2lhbCcpXG5cdCAgICA7XG5cdC8vXG5cdHBnb25zLmF0dHIoJ3BvaW50cycsIHIgPT4ge1xuXHQgICAgdHJ5IHtcblx0ICAgIC8vIHBvbHlnb24gY29ubmVjdHMgYm90dG9tIGNvcm5lcnMgb2YgMXN0IHJlY3QgdG8gdG9wIGNvcm5lcnMgb2YgMm5kIHJlY3Rcblx0ICAgIGxldCBjMSA9IGNvb3Jkc0FmdGVyVHJhbnNmb3JtKHJbMF0pOyAvLyB0cmFuc2Zvcm0gY29vcmRzIGZvciAxc3QgcmVjdFxuXHQgICAgbGV0IGMyID0gY29vcmRzQWZ0ZXJUcmFuc2Zvcm0oclsxXSk7ICAvLyB0cmFuc2Zvcm0gY29vcmRzIGZvciAybmQgcmVjdFxuXHQgICAgci50Y29vcmRzID0gW2MxLGMyXTtcblx0ICAgIC8vIGZvdXIgcG9seWdvbiBwb2ludHNcblx0ICAgIGxldCBzID0gYCR7YzEueH0sJHtjMS55K2MxLmhlaWdodH0gJHtjMi54fSwke2MyLnl9ICR7YzIueCtjMi53aWR0aH0sJHtjMi55fSAke2MxLngrYzEud2lkdGh9LCR7YzEueStjMS5oZWlnaHR9YFxuXHQgICAgcmV0dXJuIHM7XG5cdCAgICB9XG5cdCAgICBjYXRjaCAoZSkge1xuXHQgICAgICAgIGNvbnNvbGUubG9nKFwiQ2F1Z2h0IGVycm9yOlwiLCBlKTtcblx0XHRyZXR1cm4gJyc7XG5cdCAgICB9XG5cdH0pXG5cdC8vIG1vdXNpbmcgb3ZlciB0aGUgZmlkdWNpYWwgaGlnaGxpZ2h0cyAoYXMgaWYgdGhlIHVzZXIgaGFkIG1vdXNlZCBvdmVyIHRoZSBmZWF0dXJlIGl0c2VsZilcblx0Lm9uKCdtb3VzZW92ZXInLCAocCkgPT4ge1xuXHQgICAgdGhpcy5oaWdobGlnaHQocFswXSk7XG5cdH0pXG5cdC5vbignbW91c2VvdXQnLCAgKHApID0+IHtcblx0ICAgIHRoaXMuaGlnaGxpZ2h0KCk7XG5cdH0pO1xuXHQvL1xuXHRwZ29ucy5leGl0KCkucmVtb3ZlKCk7XG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ly8gRHJhdyBmZWF0dXJlIGxhYmVscy4gRWFjaCBsYWJlbCBpcyBkcmF3biBvbmNlLCBhYm92ZSB0aGUgZmlyc3QgcmVjdGFuZ2xlIGluIGl0cyBsaXN0LlxuXHQvLyBUaGUgZXhjZXB0aW9uIGlzIHRoZSBjdXJyZW50IChtb3VzZW92ZXIpIGZlYXR1cmUsIHdoZXJlIHRoZSBsYWJlbCBpcyBkcmF3biBhYm92ZSB0aGF0IGZlYXR1cmUuXG5cdGxldCBsYWJlbHMgPSBmZkdycHMuc2VsZWN0QWxsKCd0ZXh0LmZlYXRMYWJlbCcpXG5cdCAgICAuZGF0YShkID0+IHtcblx0XHRsZXQgciA9IGQucmVjdHNbMF1bMF07XG5cdFx0aWYgKGN1cnJGZWF0ICYmIChkLmZpZCA9PT0gY3VyckZlYXQuSUQgfHwgZC5maWQgPT09IGN1cnJGZWF0LmNhbm9uaWNhbCkpe1xuXHRcdCAgICBsZXQgcjIgPSBkLnJlY3RzLm1hcCggcnIgPT5cblx0XHQgICAgICAgcnJbMF0uX19kYXRhX18gPT09IGN1cnJGZWF0ID8gcnJbMF0gOiByclsxXSYmcnJbMV0uX19kYXRhX18gPT09IGN1cnJGZWF0ID8gcnJbMV0gOiBudWxsXG5cdFx0ICAgICAgICkuZmlsdGVyKHg9PngpWzBdO1xuXHRcdCAgICByID0gcjIgPyByMiA6IHI7XG5cdFx0fVxuXHQgICAgICAgIHJldHVybiBbe1xuXHRcdCAgICBmaWQ6IGQuZmlkLFxuXHRcdCAgICByZWN0OiByLFxuXHRcdCAgICB0cmVjdDogY29vcmRzQWZ0ZXJUcmFuc2Zvcm0ocilcblx0XHR9XTtcblx0ICAgIH0pO1xuXG5cdC8vIERyYXcgdGhlIHRleHQuXG5cdGxhYmVscy5lbnRlcigpLmFwcGVuZCgndGV4dCcpLmF0dHIoJ2NsYXNzJywnZmVhdExhYmVsJyk7XG5cdGxhYmVscy5leGl0KCkucmVtb3ZlKCk7XG5cdGxhYmVsc1xuXHQgIC5hdHRyKCd4JywgZCA9PiBkLnRyZWN0LnggKyBkLnRyZWN0LndpZHRoLzIgKVxuXHQgIC5hdHRyKCd5JywgZCA9PiBkLnJlY3QuX19kYXRhX18uZ2Vub21lLnpvb21ZKzE1KVxuXHQgIC50ZXh0KGQgPT4ge1xuXHQgICAgICAgbGV0IGYgPSBkLnJlY3QuX19kYXRhX187XG5cdCAgICAgICBsZXQgc3ltID0gZi5zeW1ib2wgfHwgZi5JRDtcblx0ICAgICAgIHJldHVybiBzeW07XG5cdCAgfSk7XG5cblx0Ly8gUHV0IGEgcmVjdGFuZ2xlIGJlaGluZCBlYWNoIGxhYmVsIGFzIGEgYmFja2dyb3VuZFxuXHRsZXQgbGJsQm94RGF0YSA9IGxhYmVscy5tYXAobGJsID0+IGxibFswXS5nZXRCQm94KCkpXG5cdGxldCBsYmxCb3hlcyA9IGZmR3Jwcy5zZWxlY3RBbGwoJ3JlY3QuZmVhdExhYmVsQm94Jylcblx0ICAgIC5kYXRhKChkLGkpID0+IFtsYmxCb3hEYXRhW2ldXSk7XG5cdGxibEJveGVzLmVudGVyKCkuaW5zZXJ0KCdyZWN0JywndGV4dCcpLmF0dHIoJ2NsYXNzJywnZmVhdExhYmVsQm94Jyk7XG5cdGxibEJveGVzLmV4aXQoKS5yZW1vdmUoKTtcblx0bGJsQm94ZXNcblx0ICAgIC5hdHRyKCd4JywgICAgICBiYiA9PiBiYi54LTIpXG5cdCAgICAuYXR0cigneScsICAgICAgYmIgPT4gYmIueS0xKVxuXHQgICAgLmF0dHIoJ3dpZHRoJywgIGJiID0+IGJiLndpZHRoKzQpXG5cdCAgICAuYXR0cignaGVpZ2h0JywgYmIgPT4gYmIuaGVpZ2h0KzIpXG5cdCAgICA7XG5cdFxuXHQvLyBpZiB0aGVyZSBpcyBhIGN1cnJGZWF0LCBtb3ZlIGl0cyBmaWR1Y2lhbHMgdG8gdGhlIGVuZCAoc28gdGhleSdyZSBvbiB0b3Agb2YgZXZlcnlvbmUgZWxzZSlcblx0aWYgKGN1cnJGZWF0KSB7XG5cdCAgICAvLyBnZXQgbGlzdCBvZiBncm91cCBlbGVtZW50cyBmcm9tIHRoZSBkMyBzZWxlY3Rpb25cblx0ICAgIGxldCBmZkxpc3QgPSBmZkdycHNbMF07XG5cdCAgICAvLyBmaW5kIHRoZSBvbmUgd2hvc2UgZmVhdHVyZSBpcyBjdXJyRmVhdFxuXHQgICAgbGV0IGkgPSAtMTtcblx0ICAgIGZmTGlzdC5mb3JFYWNoKCAoZyxqKSA9PiB7IGlmIChnLl9fZGF0YV9fLmZpZCA9PT0gY3VyckZlYXQuaWQpIGkgPSBqOyB9KTtcblx0ICAgIC8vIGlmIHdlIGZvdW5kIGl0IGFuZCBpdCdzIG5vdCBhbHJlYWR5IHRoZSBsYXN0LCBtb3ZlIGl0IHRvIHRoZVxuXHQgICAgLy8gbGFzdCBwb3NpdGlvbiBhbmQgcmVvcmRlciBpbiB0aGUgRE9NLlxuXHQgICAgaWYgKGkgPj0gMCkge1xuXHRcdGxldCBsYXN0aSA9IGZmTGlzdC5sZW5ndGggLSAxO1xuXHQgICAgICAgIGxldCB4ID0gZmZMaXN0W2ldO1xuXHRcdGZmTGlzdFtpXSA9IGZmTGlzdFtsYXN0aV07XG5cdFx0ZmZMaXN0W2xhc3RpXSA9IHg7XG5cdFx0ZmZHcnBzLm9yZGVyKCk7XG5cdCAgICB9XG5cdH1cblx0XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldCBzcHJlYWRUcmFuc2NyaXB0cyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zcHJlYWRUcmFuc2NyaXB0cztcbiAgICB9XG4gICAgc2V0IHNwcmVhZFRyYW5zY3JpcHRzICh2KSB7XG5cdGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5fc3ByZWFkVHJhbnNjcmlwdHMgPSB2ID8gdHJ1ZSA6IGZhbHNlO1xuXHQvLyB0cmFuc2xhdGUgZWFjaCB0cmFuc2NyaXB0IGludG8gcG9zaXRpb25cblx0bGV0IHhwcyA9IHRoaXMuc3ZnTWFpbi5zZWxlY3RBbGwoJy5mZWF0dXJlIC50cmFuc2NyaXB0cycpLnNlbGVjdEFsbCgnLnRyYW5zY3JpcHQnKTtcblx0eHBzLmF0dHIoJ3RyYW5zZm9ybScsICh4cCxpKSA9PiBgdHJhbnNsYXRlKDAsJHsgdiA/IChpICogdGhpcy5jZmcubGFuZUhlaWdodCAqICh4cC5mZWF0dXJlLnN0cmFuZCA9PT0gJy0nID8gMSA6IC0xKSkgOiAwfSlgKTtcblx0Ly8gdHJhbnNsYXRlIHRoZSBmZWF0dXJlIHJlY3RhbmdsZSBhbmQgc2V0IGl0cyBoZWlnaHRcblx0bGV0IGZycyA9IHRoaXMuc3ZnTWFpbi5zZWxlY3RBbGwoJy5mZWF0dXJlID4gcmVjdCcpXG5cdCAgICAuYXR0cignaGVpZ2h0JywgKGYsaSkgPT4ge1xuXHRcdGxldCBuTGFuZXMgPSBNYXRoLm1heCgxLCB2ID8gZi50cmFuc2NyaXB0cy5sZW5ndGggOiAxKTtcblx0ICAgICAgICByZXR1cm4gdGhpcy5jZmcubGFuZUhlaWdodCAqIG5MYW5lcyAtIHRoaXMuY2ZnLmxhbmVHYXA7XG5cdCAgICB9KVxuXHQgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGZ1bmN0aW9uIChmLCBpKSB7XG5cdFx0bGV0IGR0ID0gZDMuc2VsZWN0KHRoaXMpO1xuXHRcdGxldCBkeSA9IHBhcnNlRmxvYXQoZHQuYXR0cignaGVpZ2h0JykpIC0gc2VsZi5jZmcubGFuZUhlaWdodCArIHNlbGYuY2ZnLmxhbmVHYXA7XG5cdFx0cmV0dXJuIGB0cmFuc2xhdGUoMCwkeyBmLnN0cmFuZCA9PT0gJy0nIHx8ICF2ID8gMCA6IC1keX0pYDtcblx0ICAgIH0pXG5cdCAgICA7XG5cdHdpbmRvdy5zZXRUaW1lb3V0KCAoKSA9PiB0aGlzLmhpZ2hsaWdodCgpLCA1MDAgKTtcbiAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaGlkZUZpZHVjaWFscyAoKSB7XG5cdHRoaXMuc3ZnTWFpbi5zZWxlY3QoJ2cuZmlkdWNpYWxzJylcblx0ICAgIC5jbGFzc2VkKCdoaWRkZW4nLCB0cnVlKTtcbiAgICB9XG59IC8vIGVuZCBjbGFzcyBab29tVmlld1xuXG5leHBvcnQgeyBab29tVmlldyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi93d3cvanMvWm9vbVZpZXcuanNcbi8vIG1vZHVsZSBpZCA9IDI0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=