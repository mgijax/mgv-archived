(function () {
 
// ---------------------------------------------
class Feature {
    constructor (cfg) {
        this.chr     = cfg.chr;
        this.start   = cfg.start;
        this.end     = cfg.end;
        this.strand  = cfg.strand;
        this.type    = cfg.type;
        this.biotype = cfg.biotype;
        this.mgpid   = cfg.mgpid;
        this.mgiid   = cfg.mgiid;
        this.symbol  = cfg.symbol;
        this.genome  = cfg.genome;
        if (this.mgiid === ".") this.mgiid = null;
        if (this.symbol === ".") this.symbol = null;
    }
    //----------------------------------------------
    getMungedType () {
	return this.type === "gene" ?
	    this.biotype === "protein_coding" ?
		"protein_coding_gene"
		:
		this.biotype.indexOf("pseudogene") >= 0 ?
		    "pseudogene"
		    :
		    this.biotype.indexOf("RNA") >= 0 ?
			"ncRNA_gene"
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
// ---------------------------------------------
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
}
// ---------------------------------------------
class BlockTranslator {
    constructor(url, aGenome, bGenome, blocks){
        this.url = url;
	this.aGenome = aGenome;
	this.bGenome = bGenome;
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
    // Given a genome (either the a or b genome) and a coordinate range,
    // returns the equivalent coordinate range(s) in the other genome
    translate (fromGenome, chr, start, end) {
	// from = "a" or "b", depending on which genome is given.
	// to = "b" or "a"
        let from = (fromGenome === this.aGenome ? "a" : fromGenome === this.bGenome ? "b" : null);
	if (!from) throw "Bad argument. Genome neither A nor B.";
	let to = (from === "a" ? "b" : "a");
	// make sure the blocks are sorted by the from genome
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
	    // First filter for blocks that overlap the given coordinate range in the from genome
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
		    // also return the fromGenome coordinates corresponding to this piece of the translation
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

//----------------------------------------------
// BlockTranslator manager class
//
class BTManager {
    constructor (app) {
        this.app = app;
	this.rcBlocks = {};
    }

    //----------------------------------------------
    registerBlocks (url, aGenome, bGenome, blocks) {
	let aname = aGenome.name;
	let bname = bGenome.name;
	let blkFile = new BlockTranslator(url,aGenome,bGenome,blocks);
	if( ! this.rcBlocks[aname]) this.rcBlocks[aname] = {};
	if( ! this.rcBlocks[bname]) this.rcBlocks[bname] = {};
	this.rcBlocks[aname][bname] = blkFile;
	this.rcBlocks[bname][aname] = blkFile;
    }

    //----------------------------------------------
    getBlockFile (aGenome, bGenome) {
	// First, see if we already have this pair
	let aname = aGenome.name;
	let bname = bGenome.name;
	let bf = (this.rcBlocks[aname] || {})[bname];
	if (bf)
	    return Promise.resolve(bf);
	
	// For any given genome pair, only one of the following file
	// is generated...
	let fn1 = `./data/blockfiles/${aGenome.name}-${bGenome.name}.tsv`
	let fn2 = `./data/blockfiles/${bGenome.name}-${aGenome.name}.tsv`
	// ...so we'll try one, and if that's not it, the other.
	let self = this;
	return d3tsv(fn1)
	  .then(function(blocks){
	      // yup, it was A-B
	      self.registerBlocks(fn1, aGenome, bGenome, blocks);
	      return blocks
	  })
	  .catch(function(){
	      return d3tsv(fn2)
		  .then(function(blocks){
		      // nope, it was B-A
		      self.registerBlocks(fn2, bGenome, aGenome, blocks);
		      return blocks
		  })
		  .catch(function(e){
		      throw `Cannot get block file for this genome pair: ${aGenome.name} ${bGenome.name}.\n(Error=${e})`;
		  });
	  });
    }

    //----------------------------------------------
    ready () {
	let promises = this.app.cGenomes.map(cg => this.getBlockFile(this.app.rGenome, cg));
	return Promise.all(promises)
    }

    //----------------------------------------------
    translate (fromGenome, chr, start, end, toGenome) {
	// get the right block file
	let blkTrans = this.rcBlocks[fromGenome.name][toGenome.name];
	if (!blkTrans) throw "Internal error. No block file found in index."
	// translate!
	let ranges = blkTrans.translate(fromGenome, chr, start, end);
	return ranges;
    }
} // end class BTManager

//----------------------------------------------
class FeatureManager {
    constructor () {
        this.featCache = {};    // global index from mgpid -> feature
    }

    //----------------------------------------------
    getFeatures (genome, ranges) {
	let coordsArg = ranges.map(r => `${r.chr}:${r.start}..${r.end}`).join(',');
	let dataString = `genome=${genome.name}&coords=${coordsArg}`;
	let url = "./bin/getFeatures.cgi?" + dataString;
	return d3json(url).then(function(data) {
	    let s = data.forEach( (d,i) => {
		let r = ranges[i];
		r.features = this.processFeatures( d.features, genome );
		r.genome = genome;
	    });
	    return { genome, blocks:ranges };
	}.bind(this));
    }

    //----------------------------------------------
    processFeatures (feats, genome) {
	return feats.map(d => {
	    let mgpid = d[6];
	    if (this.featCache[mgpid])
		return this.featCache[mgpid];
	    let f = new Feature({
	      chr     : d[0],
	      start   : parseInt(d[1]),
	      end	  : parseInt(d[2]),
	      strand  : d[3],
	      type    : d[4],
	      biotype : d[5],
	      mgpid   : mgpid,
	      mgiid   : d[7],
	      symbol  : d[8],
	      genome  : genome
	    });
	    this.featCache[mgpid] = f;
	    return f;
	});
    }
} // end class Feature Manager

// ---------------------------------------------
class SVGView {
  constructor (id, width, height, app) {
    this.id = id;
    this.app = app;
    this.selector = `#${this.id} svg`;
    this.margin = {top: 35, right: 10, bottom: 20, left: 10};
    this.outerWidth = width;
    this.outerHeight = height;
    this.width = this.outerWidth - this.margin.left - this.margin.right;
    this.height = this.outerHeight - this.margin.top - this.margin.bottom;
    this.svg = d3.select(this.selector)
            .attr("width", this.outerWidth)
            .attr("height", this.outerHeight)
          .append("g")
            .attr("transform", `translate(${this.margin.left},${this.margin.top})`)
          .append("g");
  }
} // end class SVGView

// ---------------------------------------------
class GenomeView extends SVGView {
    constructor (id, width, height, app) {
        super(id, width, height, app);
	this.cwidth = 20;        // chromosome width
	this.brushChr = null;	 // which chr has the current brush
	this.bwidth = this.cwidth/2;  // block width
    }
    setBrushCoords (coords) {
	this.svg
	  .select(`g.brush[name="${ coords.chr }"]`)
	  .each(function(chr){
	    chr.brush.extent([coords.start,coords.end]);
	    chr.brush(d3.select(this));
	});
    }
    //----------------------------------------------
    brushstart (chr){
	this.clearBrushes(chr.brush);
	d3.event.sourceEvent.stopPropagation();
	this.brushChr = chr;
    }

    //----------------------------------------------
    brushend (){
	if(!this.brushChr) return;
	if(this.brushChr.brush.empty()) {
	    this.brushChr = null;
	    return;
	}
	var xtnt = this.brushChr.brush.extent();
	this.app.zoomView.setCoords({ chr:this.brushChr.name, start:Math.floor(xtnt[0]), end: Math.ceil(xtnt[1]) });
    }

    //----------------------------------------------
    clearBrushes (except){
	this.svg.selectAll('.brush').each(function(chr){
	    if (chr.brush !== except) {
		chr.brush.clear();
		chr.brush(d3.select(this));
	    }
	});
    }
    //----------------------------------------------
    draw () {

	let sdata = this.app.rGenome;

	let self = this;
	let xf = function(d){return self.bwidth+sdata.xscale(d.name);};

	// Chromosome backbones (lines)
	let ccels = this.svg.selectAll('line.chr')
	  .data(sdata.chromosomes, function(x){return x.name;});
	ccels.exit().transition().duration(this.app.dur)
	  .attr("y1", this.height)
	  .attr("y2", this.height)
	  .remove();
	ccels.enter().append('line')
	  .attr('class','chr')
	  .attr('name', c => c.name)
	  .attr("x1", xf)
	  .attr("y1", this.height)
	  .attr("x2", xf)
	  .attr("y2", this.height)
	  ;
	ccels.transition().duration(this.app.dur)
	  .attr("x1", xf)
	  .attr("y1", 0)
	  .attr("x2", xf)
	  .attr("y2", function(d){return sdata.yscale(d.length);})
	    ;

	// Chromosome labels
	let labels = this.svg.selectAll('.chrlabel')
	  .data(sdata.chromosomes, function(x){return x.name;});
	labels.exit().transition().duration(this.app.dur)
	  .attr('y', this.height)
	  .remove();
	labels.enter().append('text')
	  .attr('font-family','sans-serif')
	  .attr('font-size', 10)
	  .attr('class','chrlabel')
	  .attr('x', xf)
	  .attr('y', this.height);
	labels
	  .text(function(d){return d.name;})
	  .transition().duration(this.app.dur)
	  .attr('x', xf)
	  .attr('y', -2) ;

	// Brushes
	let brushes = this.svg.selectAll("g.brush")
	    .data(sdata.chromosomes, function(x){return x.name;});
	brushes.exit().remove();
	brushes.enter().append('g')
	    .attr('class','brush')
	    .attr('name',c=>c.name)
	    .each(function(d){d3.select(this).call(d.brush);})
	    .selectAll('rect')
	     .attr('width',10)
	     .attr('x', this.cwidth/4)
	     ;
	brushes
	    .attr('transform', function(d){return 'translate('+sdata.xscale(d.name)+')';})
	    .each(function(d){d3.select(this).call(d.brush);})
	    ;
	// Ref genome label
	let rsLabel = this.svg.selectAll("text.genomeLabel")
	    .data([this.app.rGenome]);
	rsLabel.enter().append("text").attr("class","genomeLabel");
	rsLabel.text(s => s.label)
	    .attr("x", this.width/2)
	    .attr("y", this.height - 20);
	    
	if (this.brushChr) this.brushend();
    }

} // end class GenomeView

// ---------------------------------------------
class ZoomView extends SVGView {
    constructor (id, width, height, app) {
      super(id,width,height, app);
      this.featHeight = 10;	// height of a rectangle representing a feature
      this.coords = null;
      this.genomes = []; // genomes in zoom view, top-to-bottom order
      this.stripHeight = 60; // height per genome in the zoom view
      this.svg.append("g")
        .attr("class","fiducials");
      this.svg.append("g")
        .attr("class","strips");
      d3.select(this.selector).on("click", () => this.unhighlight());
    }
    //----------------------------------------------
    update () {

	if (!this.coords) return;

	let chr = this.coords.chr;
	let start = this.coords.start;
	let end = this.coords.end;
        let mgv = this.app;

	mgv.translator.ready().then(function(){
	    // Now issue requests for features. One request per genome, each request specifies one or more
	    // coordinate ranges.
	    // Wait for all the data to become available, then draw.
	    //
	    let promises = [];

	    // First request is for the the reference genome. Get all the features in the range.
	    promises.push(mgv.featureManager.getFeatures(mgv.rGenome, [{
		chr    : chr,
		start  : start,
		end    : end,
		fChr   : chr,
		fStart : start,
		fEnd   : end,
		ori    : "+"
		}]));
	    // Add a request for each comparison genome, using translated coordinates. 
	    mgv.cGenomes.forEach(cGenome => {
		let ranges = mgv.translator.translate( mgv.rGenome, chr, start, end, cGenome );
		promises.push(mgv.featureManager.getFeatures(cGenome, ranges))
	    });
	    // when everything is ready, call the draw function
	    Promise.all(promises).then( data => mgv.zoomView.draw(data) );
	});

    }

    //----------------------------------------------
    // Sets the coordinate range of the reference genome in the zoom view and
    // redraws. The coordinates ranges of all comparison genomes are adjusted accordingly.
    // Args:
    //     coords (object) An object of the form {chr, start, end}
    setCoords (coords) {
	this.coords = coords;
	d3.select("#zoomCoords")[0][0].value = formatCoords(coords.chr, coords.start, coords.end);
	this.app.genomeView.setBrushCoords(coords);
	this.update();
    }

    //----------------------------------------------
    // Zooms in/out by factor. New zoom width is factor * the current zoom width.
    // Factor > 1 zooms out, 0 < factor < 1 zooms in.
    zoom (factor) {
	if (!this.coords) return;
	let len = this.coords.end - this.coords.start + 1;
	let newlen = Math.round(factor * len);
	let x = (this.coords.start + this.coords.end)/2;
	let newstart = Math.round(x - newlen/2);
	this.setCoords({ chr: this.coords.chr, start: newstart, end: newstart + newlen - 1 });
    }

    //----------------------------------------------
    // Pans the view left or right by factor. The distance moved is factor times the current zoom width.
    // Negative values pan left. Positive values pan right. (Note that panning moves the "camera". Panning to the
    // right makes the objects in the scene appear to move to the left, and vice versa.)
    //
    pan (factor) {
	if (!this.coords) return;
	let d = Math.round(factor * (this.coords.end - this.coords.start + 1));
	this.setCoords({ chr: this.coords.chr, start: this.coords.start + d, end: this.coords.end + d });
    }

    //----------------------------------------------
    draw (data) {

	let self = this;

	// data = [ zoomStrip_data ]
	// zoomStrip_data = { genome [ zoomBlock_data ] }
	// zoomBlock_data = { xscale, chr, start, end, fChr, fStart, fEnd, ori, [ feature_data ] }
	// feature_data = { mgpid, mgiid, symbol, chr, start, end, strand, type, biotype }
	//
	let rBlock = data[0].blocks[0];

	// x-scale
	this.xscale = d3.scale.linear()
	    .domain([rBlock.start,rBlock.end])
	    .range([0,this.width]);


	// zoom strips (contain 0 or more zoom blocks)
	let zrs = this.svg.select("g.strips")
		  .selectAll("g.zoomStrip")
		  .data(data, d => d.genome.name);
	let newZrs = zrs.enter()
	    .append("svg:g")
		.attr("class", "zoomStrip")
		.attr("name", d => d.genome.name);
	zrs.exit().remove();

	// y-coords for each genome in the zoom view
	let dy = this.stripHeight;
	d3.select(this.selector)
	    .attr("height", dy*(data.length+1));
	data.forEach( (d,i) => d.genome.zoomY = 45 + (i * dy) );
	//
	// genome labels
	newZrs.append("text") ;
	zrs.select("text")
	    .attr("x", 0)
	    .attr("y", d => d.genome.zoomY - 18)
	    .attr("font-family","sans-serif")
	    .attr("font-size", 10)
	    .text(d => d.genome.label);

	// zoom blocks
	let zbs = zrs.selectAll(".zoomBlock")
	    .data(d => d.blocks, d => d.blockId);
	//
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
	newZbs.append("text")
	    .attr("class","blockLabel") 
	    .text(b => b.chr);

	//
	zbs.exit().remove();

	// To line each chunk up with the corresponding chunk in the reference genome,
	// create the appropriate x scales.
	zbs.each( b => {
	    let x1 = this.xscale(b.fStart);
	    let x2 = this.xscale(b.fEnd);
	    b.xscale = d3.scale.linear().domain([b.start, b.end]).range([x1, x2]);
	});
	// draw the zoom block outline
	zbs.select("rect.block")
	  .attr("x", b => {
	      return b.xscale(b.start)
	  })
	  .attr("y", (b,i,j) => {
	      return data[j].genome.zoomY - 15;
	  })
	  .attr("width", b=>b.xscale(b.end)-b.xscale(b.start))
	  .attr("height", 30);

	// axis line
	zbs.select("line")
	    .attr("x1", b => b.xscale.range()[0])
	    .attr("y1", b => b.genome.zoomY )
	    .attr("x2", b => b.xscale.range()[1])
	    .attr("y2", b => b.genome.zoomY )

	zbs.select("text.blockLabel")
	    .attr("x", b => (b.xscale(b.start) + b.xscale(b.end))/2 )
	    .attr("y", b => b.genome.zoomY + 25);

	// features
	let feats = zbs.select('.features').selectAll(".feature")
	    .data(d=>d.features, d=>d.mgpid);
	feats.exit().remove();
	let newFeats = feats.enter().append("rect")
	    .attr("class", f => "feature" + (f.strand==="-" ? " minus" : " plus"))
	    .style("fill", f => self.app.cscale(f.getMungedType()))
	    .on("mouseover", function(f){ self.highlight(f,this);});

	// draw the rectangles
	let fBlock = function (featElt) {
	    let blkElt = featElt.parentNode.parentNode;
	    return blkElt.__data__;
	}
	feats
	  .attr("width", function (f) { return fBlock(this).xscale(f.end)-fBlock(this).xscale(f.start)+1 })
	  .attr("height", this.featHeight)
	  .attr("x", function (f) { return fBlock(this).xscale(f.start) })
	  .attr("y", function (f) { return f.genome.zoomY - (f.strand === "-" ? 0 : self.featHeight) })

	
	//
	this.app.facetManager.applyAll();

	//
	this.drawFiducials();
    };
    //----------------------------------------------
    highlight (f, rect) {
	this.updateFeatureDetails(f);
	this.svg.select("g.strips").selectAll(".feature")
	    .classed("highlight", function(ff) {
		let v = (f.mgiid && f.mgiid !== "." && f.mgiid === ff.mgiid) || f === ff;
		return v;
	    });
	this.drawFiducials(f);
    }

    //----------------------------------------------
    unhighlight () {
	this.svg.select("g.strips").selectAll(".feature.highlight")
	    .attr("transform", null)
	    .attr("height", this.featHeight);
	this.hideFiducials();
    }
    //----------------------------------------------
    updateFeatureDetails (f) {
	let fd = d3.select('.featureDetails');
	fd.select('.mgpid span').text(f.mgpid)
	fd.select('.type span').text(f.type)
	fd.select('.biotype span').text(f.biotype)
	fd.select('.mgiid span').text(f.mgiid)
	fd.select('.symbol span').text(f.symbol)
	fd.select('.coordinates span').text(`${f.strand}${f.chr}:${f.start}..${f.end}`)
    }
    //----------------------------------------------
    drawFiducials (f) {
	// get the "stack" of features that are highlighted
	// make sure they're sorted by Y position
	let items = this.svg.select("g.strips").selectAll(".feature.highlight")[0];
	items.sort( (a,b) => parseFloat(a.getAttribute("y")) - parseFloat(b.getAttribute("y")) );

	// put all feducial marks in their own group 
	let fGrp = this.svg.select("g.fiducials")
	    .classed("hidden", false);

	if (f) {
	    let label = fGrp.selectAll('text.featLabel')
		.data([f]);
	    label.enter().append('text').attr('class','featLabel');
	    label
	      .attr("x", 250)
	      .attr("y", 20)
	      .text(f => {
		   let sym = f.symbol && f.symbol !== "." ? f.symbol : f.mgpid;
		   return sym;
	      })
	}

	// create a polygon between each successive pair of items
	let pairs = items.map((item, i) => [item,items[i+1]]);
	pairs.splice(pairs.length - 1, 1);
	//
	let pgons = fGrp.selectAll("polygon")
	    .data(pairs)
	    ;
	pgons.exit().remove();
	pgons.enter().append("polygon")
	    .attr("class","fiducial")
	    ;
	pgons.attr("points", p => {
	    let x1 = parseFloat(p[0].getAttribute("x"));
	    let y1 = parseFloat(p[0].getAttribute("y"));
	    let w1 = parseFloat(p[0].getAttribute("width"));
	    let h1 = parseFloat(p[0].getAttribute("height"));
	    //
	    let x2 = parseFloat(p[1].getAttribute("x"));
	    let y2 = parseFloat(p[1].getAttribute("y"));
	    let w2 = parseFloat(p[1].getAttribute("width"));
	    let h2 = parseFloat(p[1].getAttribute("height"));
	    //
	    let s = `${x1},${y1+h1} ${x2},${y2} ${x2+w2},${y2} ${x1+w1},${y1+h1}`
	    //
	    return s;
	});
    }
    //----------------------------------------------
    hideFiducials () {
	this.svg.select("g.fiducials")
	    .classed("hidden", true);
    }


} // end class ZoomView


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
	if (! quietly) this.manager.applyAll();
    }
    test (f) {
        return !this.values || this.values.length === 0 || this.values.indexOf( this.valueFcn(f) ) >= 0;
    }
} // end class Facet

//----------------------------------------------
class FacetManager {
    constructor (app) {
	this.app = app;
	this.facets = [];
	this.name2facet = {}
    }
    addFacet (name, valueFcn) {
	if (this.name2facet[name]) throw "Duplicate facet name. " + name;
	let facet = new Facet(name, this, valueFcn);
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
	mgv.zoomView.svg.select("g.strips").selectAll('rect.feature')
	    .style("display", f => this.test(f) ? show : hide);
    }
} // end class FacetManager

// ---------------------------------------------
class MGVApp {
    constructor () {
	//
	this.genomeData = {}; // map from genome name -> genome data obj
	this.rGenome = null; // thereference genome
	this.cGenomes = []; // comparison genomes
	this.dur = 1500;         // anomation duration
	//
	this.allGenomes = []; // list of all genome names
	//
	this.genomeView = new GenomeView("genomeView", 800, 250, this);
	this.zoomView = new ZoomView  ("zoomView",   800, 100, this);
	this.cscale = d3.scale.category10().domain([
	    "protein_coding_gene",
	    "pseudogene",
	    "gene_segment",
	    "ncRNA_gene",
	    "other_gene",
	    "other_feature_type"
	]);
	this.translator = new BTManager(this);
	this.featureManager = new FeatureManager();

	//
	d3.select("#refGenome").on("change", () => this.go());
	d3.select("#compGenomes").on("change", () => this.go());

	// Facets
	//
	this.facetManager = new FacetManager(this);

	let ftFacet  = this.facetManager.addFacet("FeatureType", f => f.getMungedType());
	this.initFeatTypeControl(ftFacet);

	let mgiFacet = this.facetManager.addFacet("HasMgiId",    f => f.mgiid && f.mgiid !== "." ? "yes" : "no" );
	d3.select("#mgiFacet").on("change", function(){
	    mgiFacet.setValues(this.value === "" ? [] : [this.value]);
	});

	//
	d3.select("#zoomCoords").on("change", function () {
	    let coords = parseCoords(this.value);
	    if (! coords) {
		alert("Please enter a coordinate range formatted as 'chr:start..end'. For example, '5:10000000..50000000'.");
		this.value = "";
		return;
	    }
	    this.zoomView.setCoords(coords);
	});
	//
	d3.select("#zoomOut").on("click", () => this.zoomView.zoom(2));
	d3.select("#zoomIn") .on("click", () => this.zoomView.zoom(.5));
	//
	d3.select("#panLeft") .on("click", () => this.zoomView.pan(+0.5));
	d3.select("#panRight").on("click", () => this.zoomView.pan(-0.5));
	//
	d3tsv("./data/genomeList.tsv").then(function(data){
	    this.allGenomes = data.map(g => new Genome(g));
	    initOptList("#refGenome",   this.allGenomes, g=>g.name, g=>g.label, false);
	    initOptList("#compGenomes", this.allGenomes, g=>g.name, g=>g.label, true);
	    //
	    let cdps = this.allGenomes.map(g => d3tsv(`./data/genomedata/${g.name}-chromosomes.tsv`));
	    //
	    return Promise.all(cdps);
	}.bind(this))
	.then(function (data) {
	    this.processChromosomes(data);
	    this.go();
	}.bind(this))
	.catch(function(error) {
	    console.log("ERROR!", error)
	});

    }
    //----------------------------------------------
    initFeatTypeControl (facet) {
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
		facet.setValues(fts);
	    });
	ncs.append("span")
	    .text(c => c.lbl);
    }

    //----------------------------------------------
    processChromosomes (d) {
	// d is a list of chromosome lists, one per genome
	// Fill in the genomeChrs map (genome -> chr list)
	this.allGenomes.forEach((g,i) => {
	    // nicely sort the chromosomes
	    let chrs = d[i];
	    let maxlen = 0;
	    chrs.forEach( c => {
		// because I'd rather say "c.name" than "c.chromosome"
		c.name = c.chromosome;
		delete c.chromosome;
		//
		c.scale = d3.scale.linear().domain([1, c.length]).range([0, this.genomeView.height]);
		maxlen = Math.max(maxlen, c.length);
	    });
	    chrs.sort((a,b) => {
		let aa = parseInt(a.name) - parseInt(b.name);
		if (!isNaN(aa)) return aa;
		return a.name < b.name ? -1 : a.name > b.name ? +1 : 0;
	    });
	    let xs = d3.scale.ordinal()
		   .domain(chrs.map(function(x){return x.name;}))
		   .rangePoints([0, this.genomeView.width],2);
	    let ys = d3.scale.linear().domain([1,maxlen]).range([0, this.genomeView.height]);

	    chrs.forEach(function(chr){
		var sc = d3.scale.linear().domain([1,chr.length]).range([0, ys(chr.length)]);
		chr.brush = d3.svg.brush().y(sc)
		   .on("brushstart", chr => this.genomeView.brushstart(chr))
		   .on("brushend", () => this.genomeView.brushend());
	      }, this);
	    g.chromosomes = chrs;
	    g.maxlen = maxlen;
	    g.xscale = xs;
	    g.yscale = ys;
	    g.zoomY  = -1;
	    this.genomeData[g.name] = g;
	});
    }

    //----------------------------------------------
    //
    go () {
	// reference genome
	let rs = d3.select("#refGenome");
	this.rGenome = this.genomeData[rs[0][0].value];
	// comparison genomes
	let cs = d3.select("#compGenomes");
	let csos = cs[0][0].selectedOptions;
	this.cGenomes = [];
	for (let i = 0; i < csos.length; i++){
	    let csn = csos[i].value;
	    this.cGenomes.push(this.genomeData[csn]);
	}
	//
	this.genomeView.draw();
    }
} // end class MGVApp

//----------------------------------------------
//---- END CLASS DEFS --------------------------
//----------------------------------------------

// =============================================
//                    UTILS
// =============================================

// ---------------------------------------------
// Initializes an option list.
// Args:
//   selector (string) CSS selector of the container element. 
//   opts (list) List of option data objects. May be simple strings. May be more complex.
//   value (function or null) Function to produce the option value for the option data obj.
//       Defaults to the identity function (x=>x).
//   title (function or null) Function to produce the option label for the option data obj.
//       Defaults to the value function.
//   multi (boolean) Specifies if the list support multiple selections. (default = false)
// Returns:
//   The option list in a D3 selection.
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
// Formats a chromosome name, start and end position as a string.
// Returns:
//     string
// Example:
//     formatCoords("10", 10000000, 20000000) -> "10:10000000..20000000"
function formatCoords (chr, start, end) {
    return `${chr}:${start}..${end}`
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

// ---------------------------------------------
// ---------------------------------------------
let mgv = new MGVApp();

// ---------------------------------------------
})();
