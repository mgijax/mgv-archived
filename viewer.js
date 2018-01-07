(function () {
 
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
//----------------------------------------------
// Provides caller a get-features-in-range interface.
// Requests features from the server and registers them in a cache.
// Interacts with the back end to load features; tries not to request
// the same region twice.
//
class FeatureManager {
    constructor () {
        this.featCache = {};     // index from mgpid -> feature
	this.cache = {};         // {genome.name -> {chr.name -> list of blocks}}
    }
 
    //----------------------------------------------
    // Processes the "raw" features returned by the server.
    // Turns them into Feature objects and registers them.
    //
    processFeatures (feats, genome) {
	return feats.map(d => {
	    // get the ID field
	    let mgpid = d[6];
	    if (this.featCache[mgpid])
		return this.featCache[mgpid];
	    //
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
	    //
	    this.featCache[mgpid] = f;
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
        let gc = this.cache[genome.name] = (this.cache[genome.name] || {});
	let cc = gc[blk.chr] = (gc[blk.chr] || []);
	if (cc.filter(b => b.id === blk.id).length === 0) {
	    blk.features = this.processFeatures( blk.features, genome );
	    blk.genome = genome;
	    cc.push(blk);
	    cc.sort( (a,b) => a.start - b.start );
	}
	else
	    console.log("Skipped block. Already seen.", genome.name, blk.id);
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
	    let sub = rng ? subtract( rng, b ) : [];
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
    _ensureFeatures (genome, ranges) {
	let newranges = this._subtractRanges(genome, ranges);
	if (newranges.length === 0) 
	    return Promise.resolve();
	let coordsArg = newranges.map(r => `${r.chr}:${r.start}..${r.end}`).join(',');
	let dataString = `genome=${genome.name}&coords=${coordsArg}`;
	let url = "./bin/getFeatures.cgi?" + dataString;
	let self = this;
	console.log("Requesting:", genome.name, newranges);
	return d3json(url).then(function(blocks){
	    console.log("Transferred:", genome.name, blocks);
	    blocks.forEach( b => self._registerBlock(genome, b) );
	});
    }

    //----------------------------------------------
    _getCachedFeatures (genome, range) {
        let gc = this.cache[genome.name] ;
	if (!gc) return [];
	let cBlocks = gc[range.chr];
	if (!cBlocks) return [];
	let feats = cBlocks
	    .filter(cb => overlaps(cb, range))
	    .map( cb => cb.features.filter( f => overlaps( f, range) ) )
	    .reduce( (acc, val) => acc.concat(val), []);
        return feats;	
    }

    //----------------------------------------------
    getCachedById (id) {
	let ans = [];
	for (let g in this.cache) {
	    let gc = this.cache[gc];
	    let f = (gc || {})[id];
	    f && ans.push(f);
	}
	return ans;
    }

    //----------------------------------------------
    // This is what the user calls. Returns (a promise for) the features in 
    // the specified ranges of the specified genome.
    getFeatures (genome, ranges) {
	return this._ensureFeatures(genome, ranges).then(function() {
            ranges.forEach( r => {
	        r.features = this._getCachedFeatures(genome, r) 
		r.genome = genome;
	    });
	    return { genome, blocks:ranges };
	}.bind(this));
    }

} // end class Feature Manager

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
		let s2 = Math.ceil(blk[mapper](s));
		let e2 = Math.floor(blk[mapper](e));
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
		      console.log(`INFO: ${fn1} was not found. Trying ${fn2}.`);
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
	this.clearBrushes();
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
	this.app.zoomView.setCoords({ chr:this.brushChr.name, start:Math.floor(xtnt[0]), end: Math.floor(xtnt[1]) });
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
      //
      this.minSvgHeight = 250;
      this.stripHeight = 36;
      this.blockHeight = 30;
      this.topOffset = 45;
      this.featHeight = 10;	// height of a rectangle representing a feature
      this.stripHeight = 60;    // height per genome in the zoom view
      //
      this.coords = null;	// curr zoom view coords { chr, start, end }
      this.history = [];	// so user can go back
      this.hiFeats = [];	// list of IDs of Features we're highlighting. May be mgpid  or mgiId
      this.svg.append("g")
        .attr("class","fiducials");
      this.svg.append("g")
        .attr("class","strips");
      // so user can go back
      this.undoMgr = new UndoManager(25);
    }
    //----------------------------------------------
    update () {
	//
	if (!this.coords) return;
	//
	let chr = this.coords.chr;
	let start = this.coords.start;
	let end = this.coords.end;
        let mgv = this.app;
	//
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
		chr    : chr,
		start  : start,
		end    : end,
		fChr   : chr,
		fStart : start,
		fEnd   : end,
		ori    : "+",
		blockId: mgv.rGenome.name
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
    //     undoing (boolean) Optional, default=false. If true, corrdinates are being set 
    //         during an undo/redo operarion (so don't register the action with the UndoManager).
    setCoords (coords, undoing) {
	let chromosome = this.app.rGenome.chromosomes.filter(c => c.name === coords.chr)[0];
	let c;
	if (!chromosome || (coords.end - coords.start + 1) < 100){
	    c = this.coords; // invalid range. Keep the current coordinates.
	}
	else {
	    // valid range. Change the coords.
	    c = this.coords = coords;
	    if (!undoing)
	        this.undoMgr.add(coords);
	}
	c.start = Math.max(1, Math.floor(c.start))
	c.end   = Math.min(chromosome.length, Math.floor(c.end))
	d3.select("#zoomCoords")[0][0].value = formatCoords(c.chr, c.start, c.end);
	this.app.genomeView.setBrushCoords(c);
	this.update();
    }

    //----------------------------------------------
    goBack () {
        if (this.undoMgr.canUndo) {
	    this.setCoords(this.undoMgr.undo(), true);
	}
    }
    goForward () {
        if (this.undoMgr.canRedo) {
	    this.setCoords(this.undoMgr.redo(), true);
	}
    }
    clearCoordHistory () {
        this.undoMgr.clear();
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
	let width = this.coords.end - this.coords.start + 1;
	let d = Math.round(factor * width);
	let ns;
	let ne;
	if (d < 0) {
	    ns = Math.max(1, this.coords.start+d);
	    ne = ns + width - 1;
	}
	else if (d > 0) {
	    let chromosome = this.app.rGenome.chromosomes.filter(c => c.name === this.coords.chr)[0];
	    ne = Math.min(chromosome.length, this.coords.end+d)
	    ns = ne - width + 1;
	}
	this.setCoords({ chr: this.coords.chr, start: ns, end: ne });
    }

    //----------------------------------------------
    clearBrushes () {
	d3.select("#zoomView").selectAll("g.brush")
	    .each( function (b) {
	        b.brush.clear();
		d3.select(this).call(b.brush);
	    });
    }

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
	 if (rs.length > 1) throw "Internal error."
	 r = rs[0];
      }
      else {
          r.blockId = rg.name;
      }
      return r;
    }
    // handler for the start of a brush action by the user on a block
    bbStart (blk,bElt) {
      this.brushing = blk;
    }
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
	      let bb = this.svg.select(`.zoomStrip[name="${g.name}"] .zoomBlock[name="${rr.blockId}"] .brush`)
	      bb.each( function(b) {
	          b.brush.extent([rr.start, rr.end]);
		  d3.select(this).call(b.brush);
	      });
	  });
      });
    }
    bbEnd () {
      let r = this.bbGetRefCoords();
      this.brushing = null;
      //
      let se = d3.event.sourceEvent;
      if (se.ctrlKey || se.altKey || se.metaKey) {
	  this.clearBrushes();
          return;
      }
      //
      if (se.shiftKey) {
          // zoom out
	  let currWidth = this.coords.end - this.coords.start + 1;
	  let brushWidth = r.end - r.start + 1;
	  let factor = currWidth / brushWidth;
	  let newWidth = factor * currWidth;
	  let ds = ((r.start - this.coords.start + 1)/currWidth) * newWidth;
	  r.start = this.coords.start - ds;
	  r.end = r.start + newWidth - 1;
      }
      this.setCoords(r);
    }

    //----------------------------------------------
    // Draws the zoom view panel with the given data.
    // Data is structured as follows:
    //  - data is a list of items, one per strip to be displayed. Item[0] is data for the ref genome.
    //    Items[1+] are data for the comparison genome.
    //    - each strip item is an object containing a genome and a list of blocks. Item[0] always has 
    //      a single block.
    //      - each block is an object containing a chromosome, start, end, orientation, etc, and a list of features.
    //        - each feature has chr,start,end,strand,type,biotype,mgpid
    draw (data) {
	// 
	let self = this;

	// data = [ zoomStrip_data ]
	// zoomStrip_data = { genome [ zoomBlock_data ] }
	// zoomBlock_data = { xscale, chr, start, end, fChr, fStart, fEnd, ori, [ feature_data ] }
	// feature_data = { mgpid, mgiid, symbol, chr, start, end, strand, type, biotype }
	//
	let rBlock = data[0].blocks[0];

	// x-scale and x-axis based on the ref genome data.
	this.xscale = d3.scale.linear()
	    .domain([rBlock.start,rBlock.end])
	    .range([0,this.width]);
	//
	// pixels per base
	let ppb = this.width / (rBlock.end - rBlock.start + 1);

	// x-axis.
	this.axisFunc = d3.svg.axis()
	    .scale(this.xscale)
	    .orient("top")
	    .outerTickSize(0)
	    .ticks(5)
	    ;
	// axis container
	let axis = this.svg.selectAll("g.axis")
	    .data([this]);
	axis.enter().append("g").attr("class","axis");
	// inject the axis elts
	axis.call(this.axisFunc);

	// strips, one per genome
	let zrs = this.svg.select("g.strips")
		  .selectAll("g.zoomStrip")
		  .data(data, d => d.genome.name);
	let newZrs = zrs.enter()
	    .append("svg:g")
		.attr("class", "zoomStrip")
		.attr("name", d => d.genome.name);
	zrs.exit().remove();

	// reset the svg size based on number of strips
	d3.select(this.selector)
	    .attr("height", Math.max(this.minSvgHeight, this.stripHeight*(data.length+1)));

	// y-coords for each genome in the zoom view
	data.forEach( (d,i) => d.genome.zoomY = this.topOffset + (i * this.stripHeight) );
	//
	// genome labels
	newZrs.append("text") ;
	zrs.select("text")
	    .attr("x", 0)
	    .attr("y", d => d.genome.zoomY - (this.blockHeight/2 + 3))
	    .attr("font-family","sans-serif")
	    .attr("font-size", 10)
	    .text(d => d.genome.label);

	// zoom blocks
	let zbs = zrs.selectAll(".zoomBlock")
	    .data(d => d.blocks, d => d.blockId);
	//
	let newZbs = zbs.enter().append("g")
	    .attr("class", b => "zoomBlock" + (b.ori==="+" ? " plus" : " minus"))
	    .attr("name", b=>b.blockId);

	// rectangle for the whole block
	newZbs.append("rect").attr("class", "block");
	// group to hold features
	newZbs.append('g').attr('class','features');
	// the axis line
	newZbs.append("line").attr("class","axis") ;
	// label
	newZbs.append("text")
	    .attr("class","blockLabel") ;
	// brush
	newZbs.append("g").attr("class","brush");

	//
	zbs.exit().remove();

	// To line each chunk up with the corresponding chunk in the reference genome,
	// create the appropriate x scales.
	let offset = []; // offset of start  position of next block, by strip index (0===ref)
	zbs.each( (b,i,j) => { // b=block, i=index within strip, j=strip index
	    // This one scales each comp block to be the same width as its ref range.
	    // let x1 = this.xscale(b.fStart);
	    // let x2 = this.xscale(b.fEnd);
	    //
	    // This one lets each comp block be its 'actual' width
	    let x1 = i === 0 ? this.xscale(b.fStart) : offset[j];
	    let x2 = x1 + ppb * (b.end - b.start + 1)
	    b.xscale = d3.scale.linear().domain([b.start, b.end]).range([x1, x2]);
	    offset[j] = x2;
	});

	//
	zbs.select("text.blockLabel")
	    .text( b => b.chr );

	// draw the zoom block outline
	zbs.select("rect.block")
	  .attr("x", b => {
	      return b.xscale(b.start)
	  })
	  .attr("y", (b,i,j) => {
	      return data[j].genome.zoomY - this.blockHeight / 2;
	  })
	  .attr("width", b=>b.xscale(b.end)-b.xscale(b.start))
	  .attr("height", this.blockHeight);

	// axis line
	zbs.select("line.axis")
	    .attr("x1", b => b.xscale.range()[0])
	    .attr("y1", b => b.genome.zoomY)
	    .attr("x2", b => b.xscale.range()[1])
	    .attr("y2", b => b.genome.zoomY)
	    ;

	// brush
	zbs.select(".brush").each(function(b) {
	    if (!b.brush) {
	        b.brush = d3.svg.brush()
		    .on("brushstart", function(){ self.bbStart( b, this ); })
		    .on("brush",      function(){ self.bbBrush( b, this ); })
		    .on("brushend",   function(){ self.bbEnd( b, this ); })
	    }
	    b.brush.x(b.xscale).clear();
	    d3.select(this).call(b.brush);
	})
	.attr("transform", b => `translate(0,${b.genome.zoomY + this.featHeight + 6})`);

	// chromosome label 
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
	    .on("mouseover", function(f){
		self.highlight(this);
		self.updateFeatureDetails(f);
	    })
	    .on("mouseout", function(f){
		self.highlight();
	    })
	    .on("click", function(f){
		d3.event.stopPropagation();
	        let id = f.mgiid || f.mgpid;
		let i = self.hiFeats.indexOf(id);
		if (i === -1) {
		    self.hiFeats.push(id);
		}
		else {
		    self.hiFeats.splice(i,1);
		}
		self.highlight();
	    });

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
	window.setTimeout(this.highlight.bind(this), 50);
    };
    //----------------------------------------------
    // Updates highlighting in the current zoom view.
    // Highlights features in the current highlight list PLUS the feature corresponding
    // to rect (if given).  Draws fiducials for features in this list that:
    // 1. overlap the current zoomView coord range
    // 2. are not rendered invisible by current facet settings
    //
    // Args:
    //    rect (rect element) Optional. A rectangle element that was moused-over. Highlighting
    //        will include the feature corresponding to this rect along with those in the highlight list.
    //
    highlight (rect) {
	let f = rect ? rect.__data__ : null;
	let hiFeats = this.hiFeats.concat( f ? f.id : [] );
	let stacks = {}; // fid -> [ rects ] 
        let feats = this.svg.selectAll(".feature")
	  .filter(function(ff){
	      let mgi = hiFeats.indexOf(ff.mgiid) >=0;
	      let mgp = hiFeats.indexOf(ff.mgpid) >=0;
	      let showing = d3.select(this).style("display") !== "none";
	      return showing && (mgi || mgp);
	  })
	  .each(function(ff){
	      let k = ff.id;
	      if (!stacks[k]) stacks[k] = []
	      stacks[k].push(this)
	  })
	  ;
	let data = [];
	for (let k in stacks) {
	    let rects = stacks[k];
	    rects.sort( (a,b) => parseFloat(a.getAttribute("y")) - parseFloat(b.getAttribute("y")) );
	    // want a polygon between each successive pair of items
	    let pairs = rects.map((r, i) => [r,rects[i+1]]);
	    data.push({ fid: k, rects: pairs, cls: (f && f.id === k ? 'current' : '') });
	}
	this.drawFiducials(data);
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
	fd.select('.length span').text(`${f.end - f.start + 1}`)
    }
    //----------------------------------------------
    // Draws polygons that connect highlighted features in the view
    // Args:
    //   data : list of {
    //       fid: feature-id, 
    //       cls: extra class for .featureMark group,
    //       rects: list of [rect1,rect2] pairs, 
    //       }
    //
    drawFiducials (data) {

	// put feducial marks in their own group 
	let fGrp = this.svg.select("g.fiducials")
	    .classed("hidden", false);

	// Bind first level data to "featureMarks" groups
	let ffGrps = fGrp.selectAll("g.featureMarks")
	    .data(data, d => d.fid);
	ffGrps.enter().append("g")
	    .attr("name", d => d.fid);
	ffGrps.exit().remove();
	//
	ffGrps.attr("class",d => "featureMarks " + (d.cls || ""))

	//
	let labels = ffGrps.selectAll('text.featLabel')
	    .data(d => [{ fid: d.fid, rect: d.rects[0][0] }]);
	    // .data(d => d.rects.map( function (r) { return { fid: d.fid, rect: r[0] } }));
	labels.enter().append('text').attr('class','featLabel');
	labels
	  .attr("x", d => parseInt(d.rect.getAttribute("x")) + parseInt(d.rect.getAttribute("width"))/2 )
	  .attr("y", d => d.rect.__data__.genome.zoomY - this.blockHeight/2 - 3)
	  .text(d => {
	       let f = d.rect.__data__;
	       let sym = f.symbol || f.mgpid;
	       return sym;
	  });

	// Bind second level data (rectangle pairs) to polygons in the group
	let pgons = ffGrps.selectAll("polygon")
	    .data(d=>d.rects.filter(r => r[0] && r[1]));
	pgons.exit().remove();
	pgons.enter().append("polygon")
	    .attr("class","fiducial")
	    ;
	//
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
	if (! quietly) {
	    this.manager.applyAll();
	    this.manager.app.zoomView.highlight();
	}
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
	let self = this;
	//
	this.genomeData = {}; // map from genome name -> genome data obj
	this.rGenome = null; // thereference genome
	this.cGenomes = []; // comparison genomes
	this.dur = 1500;         // anomation duration
	//
	this.allGenomes = []; // list of all genome names
	//
	this.genomeView = new GenomeView("genomeView", 800, 250, this);
	this.zoomView = new ZoomView  ("zoomView",   800, 250, this);
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

	// Facets
	//
	this.facetManager = new FacetManager(this);

	let ftFacet  = this.facetManager.addFacet("FeatureType", f => f.getMungedType());
	this.initFeatTypeControl(ftFacet);

	let mgiFacet = this.facetManager.addFacet("HasMgiId",    f => f.mgiid  ? "yes" : "no" );
	d3.select("#mgiFacet").on("change", function(){
	    mgiFacet.setValues(this.value === "" ? [] : [this.value]);
	    self.zoomView.highlight();
	});

	//
	d3.select("#zoomCoords").on("change", function () {
	    let coords = parseCoords(this.value);
	    if (! coords) {
		alert("Please enter a coordinate range formatted as 'chr:start..end'. For example, '5:10000000..50000000'.");
		this.value = "";
		return;
	    }
	    self.zoomView.setCoords(coords);
	});
	//
	d3.select("#zoomOut").on("click", () => this.zoomView.zoom(2));
	d3.select("#zoomIn") .on("click", () => this.zoomView.zoom(.5));
	//
	d3.select("#panLeft") .on("click", () => this.zoomView.pan(-0.35));
	d3.select("#panRight").on("click", () => this.zoomView.pan(+0.35));
	//
	d3.select("#goBack") .on("click", () => this.zoomView.goBack());
	d3.select("#goForward").on("click", () => this.zoomView.goForward());
	//
	d3tsv("./data/genomeList.tsv").then(function(data){
	    this.allGenomes = data.map(g => new Genome(g));
	    initOptList("#refGenome",   this.allGenomes, g=>g.name, g=>g.label, false);
	    initOptList("#compGenomes", this.allGenomes, g=>g.name, g=>g.label, true);
	    //
	    d3.select("#refGenome").on("change", () => { this.zoomView.clearCoordHistory(); this.go() });
	    d3.select("#compGenomes").on("change", () => this.go());
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
    processChromosomes (d) {
	// d is a list of chromosome lists, one per genome
	// Fill in the genomeChrs map (genome -> chr list)
	this.allGenomes.forEach((g,i) => {
	    // nicely sort the chromosomes
	    let chrs = d[i];
	    let maxlen = 0;
	    chrs.forEach( c => {
		//
		c.length = parseInt(c.length)
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
	    let cg = this.genomeData[csn];
	    if (cg !== this.rGenome)
	        this.cGenomes.push(cg);
	}
	//
	this.genomeView.draw();
    }
} // end class MGVApp

// ---------------------------------------------
// UndoManager maintains a history stack of states (arbitrary objects).
//
class UndoManager {
    constructor(limit) {
        this.clear();
    }
    clear () {
        this.history = [];
        this.pointer = -1;
    }
    get currentState () {
        if (this.pointer < 0)
            throw "No current state.";
        return this.history[this.pointer];
    }
    get hasState () {
        return this.pointer >= 0;
    }
    get canUndo () {
        return this.pointer > 0;
    }
    get canRedo () {
        return this.hasState && this.pointer < this.history.length-1;
    }
    add (s) {
        //console.log("ADD");
        this.pointer += 1;
        this.history[this.pointer] = s;
        this.history.splice(this.pointer+1);
    }
    undo () {
        //console.log("UNDO");
        if (! this.canUndo) throw "No undo."
        this.pointer -= 1;
        return this.history[this.pointer];
    }
    redo () {
        //console.log("REDO");
        if (! this.canRedo) throw "No redo."
        this.pointer += 1;
        return this.history[this.pointer];
    }
} // end class UndoManager

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
    let abLeft = { chr:a.chr, start:a.start,                  end:Math.min(a.end, b.start-1) };
    let abRight= { chr:a.chr, start:Math.max(a.start, b.end+1), end:a.end };
    let ans = [ abLeft, abRight ].filter( r => r.start <= r.end );
    return ans;
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
