(function () {
 
let svgs = {
  genomeView : {
    selector : "#genomeView svg",
    margin : {top: 35, right: 10, bottom: 20, left: 10},
    outerWidth : 800,
    outerHeight : 250,
    width : -1,
    height : -1,
    svg : null
    },
  zoomView : {
    selector : "#zoomView svg",
    margin : {top: 10, right: 10, bottom: 10, left: 10},
    outerWidth : 800,
    outerHeight : 100,
    width : -1,
    height : -1,
    svg : null,
    strains : [], // strains in zoom view, top-to-bottom order
    stripHeight: 60 // height per strain in the zoom view
    }
}

let allStrains = []; // list of all strain names
let strainData = {}; // map from strain name -> strain data obj
let rStrain = null; // thereference strain
let cStrains = []; // comparison strains
let rsName = null;      // reference strain name
let csNames = [];     // list of comparison strain names
let brushChr = null;  // chromosome with current brush

let dur = 1500;         // anomation duration
let cwidth = 20;        // chromosome width
let bwidth = cwidth/2;  // block width

//
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

//
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

// ---------------------------------------------
// Initialize the strain selection lists. 
// Args:
//  selector (string) CSS selector of the container element. 
//  opts (list) List of option data objects. May be simple strings. May be more complex.
//  value (function or null) Function to produce the option value for the option data obj.
//       Defaults to the identity function (x=>x).
//  title (function or null) Function to produce the option label for the option data obj.
//       Defaults to the value function.
//  multi (boolean) Specifies if the list support multiple selections. (default = false)
function initOptList( selector, opts, value, text, multi ) {
    let s = d3.select(selector);
    s.property('multiple', multi || null) ;
    let os = s.selectAll("option").data(opts);
    let ident = d => d;
    value = value || ident;
    text = text || value;
    os.enter().append("option") ;
    os.exit().remove() ;
    os.attr("value", value)
      .text( text ) ;
    return s;
}

//----------------------------------------------
//
function setup () {
    //
    setupSvgs();
    //
    d3.select("#refStrain").on("change", go);
    d3.select("#compStrains").on("change", go);
    //
    drawColorKey();
    //
    d3.select("#mgiFacet").on("change", function(){setMgiFacet(this.value);});
    //
    d3.select("#zoomCoords").on("change", function () {
        let coords = parseCoords(this.value);
	if (! coords) {
	    alert("Please enter a coordinate range formatted as 'chr:start..end'. For example, '5:10000000..50000000'.");
	    this.value = "";
	    return;
	}
	setZoomCoords(coords);
    });
    //
    d3tsv("./data/strainList.tsv").then(function(data){
        allStrains = data.map(s => s.strain);
        initOptList("#refStrain", allStrains);
        initOptList("#compStrains", allStrains, null, null, true);
        //
        return Promise.all(allStrains.map(s => d3tsv(`./data/straindata/${s}-chromosomes.tsv`)));
    })
    .then(function (data) {
        processChromosomes(data);
        go();
    })
    .catch(function(error) {
        console.log("ERROR!", error)
    });

}

function formatCoords (chr, start, end) {
    return `${chr}:${start}..${end}`
}
function parseCoords (coords) {
    let re = /([^:]+):(\d+)\.\.(\d+)/;
    let m = coords.match(re);
    return m ? {chr:m[1], start:parseInt(m[2]), end:parseInt(m[3])} : null;
}
function setZoomCoords (coords) {
    d3.select("#zoomCoords")[0][0].value = formatCoords(coords.chr, coords.start, coords.end);
    svgs.genomeView.svg.select(`g.brush[name="${ coords.chr }"]`).each(function(chr){
	chr.brush.extent([coords.start,coords.end]);
	chr.brush(d3.select(this));
    });
    updateZoomView(rStrain, coords.chr, coords.start, coords.end, cStrains)
}

function setupSvgs() {
    for(let n in svgs){
        let c = svgs[n];
        c.width = c.outerWidth - c.margin.left - c.margin.right;
        c.height = c.outerHeight - c.margin.top - c.margin.bottom;
        c.svg = d3.select(c.selector)
            .attr("width", c.outerWidth)
            .attr("height", c.outerHeight)
          .append("g")
            .attr("transform", "translate(" + c.margin.left + "," + c.margin.top + ")")
          .append("g");
    }
}

function processChromosomes (d) {
    // d is a list of chromosome lists, one per strain
    // Fill in the strainChrs map (strain -> chr list)
    allStrains.forEach((s,i) => {
        // nicely sort the chromosomes
        let chrs = d[i];
        let maxlen = 0;
        chrs.forEach( c => {
            // I'd rather say "c.name" than "c.chromosome"
            c.name = c.chromosome;
            delete c.chromosome;
            c.scale = d3.scale.linear().domain([1, c.length]).range([0, svgs.genomeView.height]);
            maxlen = Math.max(maxlen, c.length);
        });
        chrs.sort((a,b) => {
            let aa = parseInt(a.name) - parseInt(b.name);
            if (!isNaN(aa)) return aa;
            return a.name < b.name ? -1 : a.name > b.name ? +1 : 0;
        });
        let xs = d3.scale.ordinal()
               .domain(chrs.map(function(x){return x.name;}))
               .rangePoints([0, svgs.genomeView.width],2);
        let ys = d3.scale.linear().domain([1,maxlen]).range([0, svgs.genomeView.height]);
        let cs = d3.scale.category20().domain(chrs.map(function(x){return x.name;}));

	chrs.forEach(function(chr){
	    var sc = d3.scale.linear().domain([1,chr.length]).range([0, ys(chr.length)]);
            chr.brush = d3.svg.brush().y(sc)
               .on("brushstart",brushstart)
               .on("brushend",brushend);
	  });
        strainData[s] = {
	    name : s,
            chromosomes : chrs,
            maxlen : maxlen,
            xscale : xs,
            yscale : ys,
            cscale : cs,
	    zoomY  : -1
        };
    });
}


function brushstart(chr){
    clearBrushes(chr.brush);
    d3.event.sourceEvent.stopPropagation();
    brushChr = chr;
}

function brushend(chr){
    if(chr.brush.empty()) {
	brushChr = null;
	return;
    }
    var xtnt = chr.brush.extent();
    setZoomCoords({ chr:chr.name, start:Math.floor(xtnt[0]), end: Math.ceil(xtnt[1]) });
}

function clearBrushes(except){
    d3.selectAll('.brush').each(function(chr){
        if (chr.brush !== except) {
            chr.brush.clear();
            chr.brush(d3.select(this));
        }
    });
}
//----------------------------------------------
//
function go() {
    // reference strain
    let rs = d3.select("#refStrain");
    rsName = rs[0][0].value
    rStrain = strainData[rsName]
    // comparison strains
    let cs = d3.select("#compStrains");
    // cs.select(`option[value="${rsName}"]`).property('selected', true);
    let csos = cs[0][0].selectedOptions;
    csNames = [];
    cStrains = [];
    for (let i = 0; i < csos.length; i++){
	let csn = csos[i].value;
        csNames.push(csn);
	cStrains.push(strainData[csn]);
    }
    //
    drawGenomeView();
    if (brushChr) brushend(brushChr);
}

//----------------------------------------------
class BlockFile {
    constructor(url, aStrain, bStrain, blocks){
        this.url = url;
	this.aStrain = aStrain;
	this.bStrain = bStrain;
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
    setSort (aorb) {
	if (aorb !== 'a' && aorb !== 'b') throw "Bar argument:" + aorb;
        if (this.currentSort === aorb) return;
	this.flipSort();
    }
    flipSort () {
	let newSort = this.currSort === "a" ? "b" : "a";
	let sortCol = newSort === "a" ? "aIndex" : "bIndex";
	let cmp = (x,y) => x[sortCol] - y[sortCol];
	this.blocks.sort(cmp);
	this.currSort = newSort;
    }
    // Given a strain (either the a or b strain) and a coordinate range,
    // returns the equivalent coordinate range(s) in the other strain
    translate (fromStrain, chr, start, end) {
	// from = "a" or "b", depending on which strain is given.
	// to = "b" or "a"
        let from = (fromStrain === this.aStrain ? "a" : fromStrain === this.bStrain ? "b" : null);
	if (!from) throw "Bad argument. Strain neither A nor B.";
	let to = (from === "a" ? "b" : "a");
	// make sure the blocks are sorted by the from strain
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
	    // First filter for blocks that overlap the given coordinate range in the from strain
	    .filter(blk => blk[fromC] === chr && blk[fromS] <= end && blk[fromE] >= start)
	    // map each block. 
	    .map(blk => {
		// coord range on the from side.
		let s = Math.max(start, blk[fromS]);
		let e = Math.min(end, blk[fromE]);
		// coord range on the to side.
		let s2 = Math.round(blk[mapper](s));
		let e2 = Math.round(blk[mapper](e));
	        return {
		    chr:   blk[toC],
		    start: Math.min(s2,e2),
		    end:   Math.max(s2,e2),
		    ori:   blk.blockOri,
		    // also return the fromStrain coordinates corresponding to this piece of the translation
		    fChr:   blk[fromC],
		    fStart: s,
		    fEnd:   e,
		    // include the block id corresponding to this piece
		    blockId: blk.blockId
		};
	    })
	// 
	return blks;
    }
}
let rcBlocks = {};
function registerBlocks(url, aStrain, bStrain, blocks){
    let aname = aStrain.name;
    let bname = bStrain.name;
    let blkFile = new BlockFile(url,aStrain,bStrain,blocks);
    if( ! rcBlocks[aname]) rcBlocks[aname] = {};
    if( ! rcBlocks[bname]) rcBlocks[bname] = {};
    rcBlocks[aname][bname] = blkFile;
    rcBlocks[bname][aname] = blkFile;
}
function getBlockFile(aStrain, bStrain){
    // First, see if we already have this pair
    let aname = aStrain.name;
    let bname = bStrain.name;
    let bf = (rcBlocks[aname] || {})[bname];
    if (bf)
        return Promise.resolve(bf);
    
    // For any given strain pair, only one of the following file
    // is generated...
    let fn1 = `./data/blockfiles/${aStrain.name}-${bStrain.name}.tsv`
    let fn2 = `./data/blockfiles/${bStrain.name}-${aStrain.name}.tsv`
    // ...so we'll try one, and if that's not it, the other.
    return d3tsv(fn1)
      .then(function(blocks){
	  // yup, it was A-B
	  registerBlocks(fn1, aStrain, bStrain, blocks);
	  return blocks
      })
      .catch(function(){
          return d3tsv(fn2)
	      .then(function(blocks){
		  // nope, it was B-A
		  registerBlocks(fn2, bStrain, aStrain, blocks);
		  return blocks
	      })
	      .catch(function(e){
	          throw `Cannot get block file for this strain pair: ${aStrain.name} ${bStrain.name}.\n(Error=${e})`;
	      });
      });
}

function getBlockFiles(rStrain, cStrains) {
    let promises = cStrains.map(s => getBlockFile(rStrain, s));
    return Promise.all(promises)
}

//----------------------------------------------
function drawGenomeView() {

    let svg = svgs.genomeView;

    let sdata = strainData[rsName];

    let xf = function(d){return bwidth+sdata.xscale(d.name);};

    // Chromosome backbones (lines)
    let ccels = svg.svg.selectAll('line.chr')
      .data(sdata.chromosomes, function(x){return x.name;});
    ccels.exit().transition().duration(dur)
      .attr("y1", svg.height)
      .attr("y2", svg.height)
      .remove();
    ccels.enter().append('line')
      .attr('class','chr')
      .attr('name', c => c.name)
      .attr("x1", xf)
      .attr("y1", svg.height)
      .attr("x2", xf)
      .attr("y2", svg.height)
      ;
    ccels.transition().duration(dur)
      .attr("x1", xf)
      .attr("y1", 0)
      .attr("x2", xf)
      .attr("y2", function(d){return sdata.yscale(d.length);})
	;

    // Chromosome labels
    labels = svg.svg.selectAll('.chrlabel')
      .data(sdata.chromosomes, function(x){return x.name;});
    labels.exit().transition().duration(dur)
      .attr('y', svg.height)
      .remove();
    labels.enter().append('text')
      .attr('font-family','sans-serif')
      .attr('font-size', 10)
      .attr('class','chrlabel')
      .attr('x', xf)
      .attr('y', svg.height);
    labels
      .text(function(d){return d.name;})
      .transition().duration(dur)
      .attr('x', xf)
      .attr('y', -2) ;

    // Brushes
    brushes = svg.svg.selectAll("g.brush")
        .data(sdata.chromosomes, function(x){return x.name;});
    brushes.exit().remove();
    brushes.enter().append('g')
        .attr('class','brush')
        .attr('name',c=>c.name)
        .each(function(d){d3.select(this).call(d.brush);})
	.selectAll('rect')
	 .attr('width',10)
	 .attr('x', cwidth/4)
	 ;
    brushes
        .attr('transform', function(d){return 'translate('+sdata.xscale(d.name)+')';})
        .each(function(d){d3.select(this).call(d.brush);})
	;
}

let featCache = {};    // global index from mgpid -> feature
function getFeatures(strain, ranges){
    let coordsArg = ranges.map(r => `${r.chr}:${r.start}..${r.end}`).join(',');
    let dataString = `strain=${strain.name}&coords=${coordsArg}`;
    let url = "./bin/getFeatures.cgi?" + dataString;
    return d3json(url).then(function(data) {
	let s = data.forEach( (d,i) => {
	    let r = ranges[i];
	    r.features = processFeatures( d.features )
	});
	return { strain, blocks:ranges };
    });
}

function processFeatures (feats) {
    return feats.map(d => {
	mgpid = d[6];
	if (featCache[mgpid])
	    return featCache[mgpid];
        let r = {
	  chr     : d[0],
	  start   : parseInt(d[1]),
	  end	  : parseInt(d[2]),
	  strand  : d[3],
	  type    : d[4],
	  biotype : d[5],
	  mgpid   : mgpid,
	  mgiid   : d[7],
	  symbol  : d[8],
	};
	featCache[mgpid] = r;
	return r;
    });
}


//----------------------------------------------
function updateZoomView(rStrain, chr, start, end, cStrains){

    // make sure we've loaded the coordinate mapping data for these strains
    getBlockFiles(rStrain, cStrains).then(function(){
	// OK, got the maps.
	// Now issue requests for features. One request per strain, each request specifies one or more
	// coordinate ranges.
	// Wait for all the data to become available, then draw.
	//
	let promises = [];

	// First request is for the the reference strain. Get all the features in the range.
	promises.push(getFeatures(rStrain, [{
	    chr    : chr,
	    start  : start,
	    end    : end,
	    fChr   : chr,
	    fStart : start,
	    fEnd   : end,
	    ori    : "+"
	    }]));
	// Add a request for each comparison strain, using translated coordinates. 
	cStrains.forEach(cStrain => {
	    // get the right block file
	    let blkFile = (rcBlocks[rStrain.name] || {})[cStrain.name];
	    if (!blkFile) throw "Internal error. No block file found in index."
	    // translate!
	    let ranges = blkFile.translate(rStrain, chr, start, end);
	    promises.push(getFeatures(cStrain, ranges))
	});
	// when everything is ready, call the draw function
	Promise.all(promises).then( drawZoomView );
    });

}

function drawZoomView(data) {
    // data = [ zoomStrip_data ]
    // zoomStrip_data = { strain [ zoomBlock_data ] }
    // zoomBlock_data = { xscale, chr, start, end, fChr, fStart, fEnd, ori, [ feature_data ] }
    // feature_data = { mgpid, mgiid, symbol, chr, start, end, strand, type, biotype }
    //
    let v = svgs.zoomView;

    //
    let rBlock = data[0].blocks[0];

    // x-scale
    v.xscale = d3.scale.linear()
        .domain([rBlock.start,rBlock.end])
	.range([0,v.width]);


    // zoom strip (contain 0 or more zoom blocks)
    let zrs = v.svg
              .selectAll("g.zoomStrip")
              .data(data, d => d.strain.name);
    let newZrs = zrs.enter()
        .append("svg:g")
            .attr("class", "zoomStrip")
	    .attr("name", d => d.strain.name);
    zrs.exit().remove();

    // y-coords for each strain in the zoom view
    let dy = v.stripHeight;
    d3.select(svgs.zoomView.selector)
        .attr("height", dy*(data.length+1));
    data.forEach( (d,i) => d.strain.zoomY = 45 + (i * dy) );
    //
    // strain labels
    newZrs.append("text") ;
    zrs.select("text")
	.attr("x", 0)
	.attr("y", d => d.strain.zoomY - 18)
	.attr("font-family","sans-serif")
	.attr("font-size", 10)
        .text(d => d.strain.name);

    // zoom blocks
    let zbs = zrs.selectAll(".zoomBlock")
        .data(d => d.blocks, d => d.blockId);
    zbs.exit().remove();
    let newZbs = zbs.enter().append("g")
        .attr("class", b => "zoomBlock" + (b.ori==="+" ? " plus" : " minus"))
	.attr("name", d=>d.blockId);
    // rectangle for the whole block
    newZbs.append("rect").attr("class", "block");
    // group to hold features
    newZbs.append('g').attr('class','features');
    // the axis line
    newZbs.append("line").attr("class","axis") ;
    // label
    newZbs.append("text") ;

    // To line each chunk up with the corresponding chunk in the reference strain,
    // create the appropriate x scales.
    zbs.each( b => {
	let x1 = v.xscale(b.fStart);
	let x2 = v.xscale(b.fEnd);
	b.xscale = d3.scale.linear().domain([b.start, b.end]).range([x1, x2]);
    });
    // draw the zoom block outline
    zbs.select("rect.block")
      .attr("x", b => {
          return b.xscale(b.start)
      })
      .attr("y", (b,i,j) => {
	  return data[j].strain.zoomY - 15;
      })
      .attr("width", b=>b.xscale(b.end)-b.xscale(b.start))
      .attr("height", 30);

    // axis line
    zbs.select("line")
	.attr("x1", b => b.xscale.range()[0])
	.attr("y1", (b,i,j) => data[j].strain.zoomY )
	.attr("x2", b => b.xscale.range()[1])
	.attr("y2", (b,i,j) => data[j].strain.zoomY )

    // features
    let feats = zbs.select('.features').selectAll(".feature")
        .data(d=>d.features, d=>d.mgpid);
    feats.exit().remove();
    let newFeats = feats.enter().append("rect")
        .attr("class", f => "feature" + (f.strand==="-" ? " minus" : " plus"))
	.on("mouseover", highlight);

    // draw the rectangles
    let rHeight = 10;
    let fBlock = function (featElt) {
        let blkElt = featElt.parentNode.parentNode;
	return blkElt.__data__;
    }
    let fStrain = function (featElt) {
        let blkElt = featElt.parentNode.parentNode;
	let stripElt = blkElt.parentNode;
	return stripElt.__data__.strain;
    }
    feats
      .attr("x", function (f) { return fBlock(this).xscale(f.start) })
      .attr("y", function (f) { return fStrain(this).zoomY - (f.strand === "-" ? 0 : rHeight) })
      .attr("width", function (f) { return fBlock(this).xscale(f.end)-fBlock(this).xscale(f.start)+1 })
      .attr("height", rHeight)
      .style("fill", f => cscale(getMungedType(f)));

};

let cscale = d3.scale.category10().domain([
        "protein_coding_gene",
	"pseudogene",
	"gene_segment",
	"ncRNA_gene",
	"other_gene",
	"other_feature_type"
    ]);

function fText(f){
    return f.symbol === "." ?
	    `${f.mgpid}\n${f.type}/${f.biotype}`
	    :
	    `${f.symbol}\n${f.mgiid}\n${f.mgpid}\n${f.type}/${f.biotype}` ;
}

function updateFeatureDetails (f) {
    let fd = d3.select('.featureDetails');
    fd.select('.mgpid span').text(f.mgpid)
    fd.select('.type span').text(f.type)
    fd.select('.biotype span').text(f.biotype)
    fd.select('.mgiid span').text(f.mgiid)
    fd.select('.symbol span').text(f.symbol)
    fd.select('.coordinates span').text(`${f.strand}${f.chr}:${f.start}..${f.end}`)
}

function highlight(f) {
    updateFeatureDetails(f);
    let hls = [];
    svgs.zoomView.svg.selectAll(".feature")
        .classed("highlight", function(ff) {
	    let v = (f.mgiid && f.mgiid !== "." && f.mgiid === ff.mgiid) || f === ff;
	    v && hls.push(this);
	    return v;
	});
}

function drawColorKey() {
    let colors = cscale.domain().map(lbl => {
        return { lbl:lbl, clr:cscale(lbl) };
    });
    let ckes = d3.select(".colorKey")
        .selectAll('.colorKeyEntry')
	    .data(colors);
    let ncs = ckes.enter().append("div")
        .attr("class", "colorKeyEntry flexrow");
    ncs.append("div")
        .attr("class","swatch")
	.style("background-color", c => c.clr);
    ncs.append("input")
	.attr("name", "featureType")
	.property("type", "checkbox")
	.property("value", c => c.lbl)
	.on("change", function () {
	    // get all the currently checked feature types
	    let fts = []
	    d3.selectAll('input[type="checkbox"][name="featureType"]')
		.each(function(d){
		    if (this.checked) fts.push(this.value);
		});
	    setFeatureTypeFacet(fts);
	});
    ncs.append("span")
	.text(c => c.lbl);
}


// ---------------------------------------------
// ---------------------------------------------
let facets = {
  featureTypes: [],
  mgiIds: "",
};

function setMgiFacet(v) {
    facets.mgiIds = v;
    applyFacets();
}

function setFeatureTypeFacet(ftypes) {
    facets.featureTypes = ftypes;
    applyFacets();
}

function applyFacets() {
    let show = null;
    let hide = "none";
    //
    let fts = facets.featureTypes;
    function ftFilter (f) {
	return fts.length===0 || fts.indexOf(getMungedType(f)) >= 0 
    };
    //
    let mgi = facets.mgiIds;
    function mgiFilter (f) {
	return mgi === "yes" ? (f.mgiid && f.mgiid !== ".") : mgi === "no" ? (!f.mgiid || f.mgiid === ".") : true;
    };
    svgs.zoomView.svg.selectAll('rect.feature')
        .style("display", f => (ftFilter(f) && mgiFilter(f)) ? show : hide);

}

function getMungedType(f) {
    return f.type === "gene" ?
	f.biotype === "protein_coding" ?
	    "protein_coding_gene"
	    :
	    f.biotype.indexOf("pseudogene") >= 0 ?
		"pseudogene"
		:
		f.biotype.indexOf("RNA") >= 0 ?
		    "ncRNA_gene"
		    :
		    "other_gene"
	:
	f.type === "pseudogene" ?
	    "pseudogene"
	    :
	    f.type.indexOf("gene_segment") >= 0 ?
		"gene_segment"
		:
		f.type.indexOf("RNA") >= 0 ?
		    "ncRNA_gene"
		    :
		    f.type.indexOf("gene") >= 0 ?
			"other_gene"
			:
			"other_feature_type";
}

// ---------------------------------------------
//----------------------------------------------
setup();

//----------------------------------------------
})();
