(function () {
 
// ---------------------------------------------
// Interacts with localStorage.
class StorageManager {
    constructor (name, storage) {
	this.name = name;
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

class SessionStorageManager extends StorageManager {
    constructor (name) {
        super(name, window.sessionStorage);
    }
}

class LocalStorageManager extends StorageManager {
    constructor (name) {
        super(name, window.localStorage);
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
// Provides a get-features-in-range interface.
// Requests features from the server and registers them in a cache.
// Interacts with the back end to load features; tries not to request
// the same region twice.
//
class FeatureManager {
    constructor (app) {
        this.app = app;
        this.featCache = {};     // index from mgpid -> feature
	this.mgiCache = {};	 // index from mgiid -> [ features ]
	this.cache = {};         // {genome.name -> {chr.name -> list of blocks}}

	this.mineFeatureCache = {}; // auxiliary info pulled from MouseMine 
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
	    let f = this.featCache[d.mgpid];
	    if (f) return f;
	    // Create a new Feature
	    d.genome = genome
	    f = new Feature(d);
	    // Register it.
	    this.featCache[f.mgpid] = f;
	    if (f.mgiid) {
		let lst = this.mgiCache[f.mgiid] = (this.mgiCache[f.mgiid] || []);
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
        let gc = this.cache[genome.name] = (this.cache[genome.name] || {});
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
	//console.log("Requesting:", genome.name, newranges);
	return d3json(url).then(function(blocks){
	    //console.log("Transferred:", genome.name, blocks);
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
    getCachedFeaturesByMgiId (mgiid) {
        return this.mgiCache[mgiid] || [];
    }

    //----------------------------------------------
    // This is what the user calls. Returns a promise for the features in 
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
    //----------------------------------------------
    getFeaturesById (genome, ids) {
	// subtract ids of features already in the cache
	let needids = ids.filter(i => !(i in this.featCache || i in this.mgiCache));
	let dataString = `genome=${genome.name}&ids=${needids.join("+")}`;
	let url = "./bin/getFeatures.cgi?" + dataString;
	let self = this;
	console.log("Requesting IDs:", genome.name, needids);
	return d3json(url).then(function(data){
	    console.log("Transferred IDs:", genome.name, feats);
	});
    }

} // end class Feature Manager

// ---------------------------------------------
// AuxDataManager - knows how to query an external source (i.e., MouseMine) for genes
// annotated to different ontologies. 
class AuxDataManager {
    constructor (app) {
	this.app = app;
    }

    //----------------------------------------------
    getAuxData (q) {
	let format = 'jsonobjects';
	let query = encodeURIComponent(q);
	let url = `http://www.mousemine.org/mousemine/service/query/results?format=${format}&query=${query}`;
	return d3json(url).then(data => data.results||[]);
    }

    //----------------------------------------------
    // do a LOOKUP query for SequenceFeatures from MouseMine
    featuresByLookup (qryString) {
	let q = `<query name="" model="genomic" view="SequenceFeature.primaryIdentifier SequenceFeature.symbol" longDescription="" constraintLogic="A and B">
	    <constraint path="SequenceFeature" code="A" op="LOOKUP" value="${qryString}"/>
	    <constraint path="SequenceFeature.organism.taxonId" code="B" op="=" value="10090"/>
	    </query>`;
	return this.getAuxData(q);
    }
    //----------------------------------------------
    featuresByOntologyTerm (qryString, termType) {
        let q = `<query name="" model="genomic" 
	  view="SequenceFeature.primaryIdentifier SequenceFeature.symbol" longDescription="" sortOrder="SequenceFeature.symbol asc">
	      <constraint path="SequenceFeature.ontologyAnnotations.ontologyTerm" type="${termType}"/>
	      <constraint path="SequenceFeature.ontologyAnnotations.ontologyTerm.parents" type="${termType}"/>
	      <constraint path="SequenceFeature.ontologyAnnotations.ontologyTerm.parents" code="A" op="LOOKUP" value="${qryString}"/>
	      <constraint path="SequenceFeature.organism.taxonId" code="B" op="=" value="10090"/>
	  </query>`
	return this.getAuxData(q);
    }
    //----------------------------------------------
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
    featuresByPathway   (qryString) { return this.featuresByPathwayTerm(qryString); }
    featuresByPhenotype (qryString) { return this.featuresByOntologyTerm(qryString, "MPTerm"); }
    featuresByDisease   (qryString) { return this.featuresByOntologyTerm(qryString, "DOTerm"); }
    //----------------------------------------------
}

// ---------------------------------------------
// Maintains named lists of IDs. Lists may be temporary, lasting only for the session, or permanent,
// lasting until the user clears the browser local storage area.
//
// Uses window.sessionStorage and window.localStorage to save lists
// temporarily or permanently, resp.  FIXME: should be using window.indexedDB
//
class ListManager {
    constructor () {
	this.name2list = null;
	this._lists = new LocalStorageManager  ("listManager.lists")
	//
	this._load();
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
        this.has(name) ? this.updateList(name,null,ids) : this.create(name, ids);
    }
    // creates a new list with the given name and ids.
    create (name, ids) {
	if (this.has(name)) throw "Create rejected because list exists: " + name;
	//
	let dt = new Date() + "";
	this.name2list[name] = {
	    name:     name,
	    ids:      ids,
	    created:  dt,
	    modified: dt
	};
	this._save();
    }
    // updates the ids in the given list
    updateList (name, newname, newids) {
	let lst = this.get(name);
        if (! lst) throw "No such list: " + name;
	if (newname) {
	    if (this.has(newname) && newname !== name) throw "Name already exists: " + newname;
	    delete this.name2list[lst.name];
	    lst.name = newname;
	    this.name2list[lst.name] = lst;
	}
	if (newids) lst.ids  = newids;
	lst.modified = new Date() + "";
	this._save();
    }
    // deletes the specified list
    deleteList (name) {
        let lst = this.get(name);
	delete this.name2list[name];
	this._save();
    }
    // delete all lists
    purge () {
        this.name2list = {}
	this._save();
    }
}

// ---------------------------------------------
// Something that knows how to translate coordinates between two genomes.
//
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
    translate (fromGenome, chr, start, end) {
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
	let toC = to+"Chr";
	let toS = to+"Start";
	let toE = to+"End";
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
		    toChr:     blk[toC],
		    toStart:   blk[toS],
		    toEnd:     blk[toE],
		};
	    })
	// 
	return blks;
    }
}

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
	let aname = aGenome.name;
	let bname = bGenome.name;
	let blkFile = new BlockTranslator(url,aGenome,bGenome,blocks);
	if( ! this.rcBlocks[aname]) this.rcBlocks[aname] = {};
	if( ! this.rcBlocks[bname]) this.rcBlocks[bname] = {};
	this.rcBlocks[aname][bname] = blkFile;
	this.rcBlocks[bname][aname] = blkFile;
    }

    //----------------------------------------------
    // Loads the synteny block file for genomes aGenome and bGenome.
    // 
    getBlockFile (aGenome, bGenome) {
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
	// The file for A->B is simply a resort of the file from B->A. So the 
	// back end only creates one of them.
	// We'll try one and if that's not it, then try the other.
	// (And if THAT's not it, then cry a river...)
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
		      console.log(`INFO: Disregard that 404 message! ${fn1} was not found. Trying ${fn2}.`);
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
    // Returns the synteny blocks that map the current ref genome to the specified comparison genome.
    //
    getBlocks (fromGenome, toGenome) {
        let blkTrans = this.rcBlocks[fromGenome.name][toGenome.name];
	return blkTrans.getBlocks(fromGenome)
    }

    //----------------------------------------------
    // Translates the given coordinate range from the specified fromGenome to the specified toGenome.
    // Returns a list of zero or more coordinate ranges in the toGenome.
    //
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
    this.app = app;
    this.id = id;
    this.container = d3.select(`#${this.id}`);
    this.selector = `#${this.id} svg`;
    this.svg = d3.select(this.selector);
    this.svgMain = this.svg
          .append("g")    // the margin-translated group
          .append("g");	  // main group for the drawing
    this.setSize(width, height, {top: 20, right: 10, bottom: 20, left: 10});
  }
  setSize (width, height, margin) {
    this.outerWidth  = width  || this.outerWidth;
    this.outerHeight = height || this.outerHeight;
    this.margin      = margin || this.margin;
    //
    this.width  = this.outerWidth  - this.margin.left - this.margin.right;
    this.height = this.outerHeight - this.margin.top  - this.margin.bottom;
    //
    this.svg.attr("width", this.outerWidth)
            .attr("height", this.outerHeight)
          .select("g")
            .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
  }
  // Args:
  //   the window width
  fitToWidth (width) {
      let r = this.svg[0][0].getBoundingClientRect();
      this.setSize(width - r.x)
  }

} // end class SVGView

// ---------------------------------------------
class GenomeView extends SVGView {
    constructor (id, width, height, app) {
        super(id, width, height, app);
	this.cwidth = 20;        // chromosome width
	this.brushChr = null;	 // which chr has the current brush
	this.bwidth = this.cwidth/2;  // block width
	this.currBlocks = null;
	this.currTicks = null;
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
	var xtnt = this.brushChr.brush.extent();
	if (Math.abs(xtnt[0] - xtnt[1]) <= 10){
	    // user clicked
	    let cxt = this.app.getContext()
	    let w = cxt.end - cxt.start + 1;
	    xtnt[0] -= w/2;
	    xtnt[1] += w/2;
	}
	let coords = { chr:this.brushChr.name, start:Math.floor(xtnt[0]), end: Math.floor(xtnt[1]) };
	this.app.setContext(coords);
    }

    //----------------------------------------------
    clearBrushes (except){
	this.svgMain.selectAll('.brush').each(function(chr){
	    if (chr.brush !== except) {
		chr.brush.clear();
		chr.brush(d3.select(this));
	    }
	});
    }

    //----------------------------------------------
    getX (chr) {
	return this.app.rGenome.xscale(chr);
    }
    //----------------------------------------------
    getY (pos) {
	return this.app.rGenome.yscale(pos);
    }
    
    //----------------------------------------------
    redraw () {
        this.draw(this.currTicks, this.currBlocks);
    }

    //----------------------------------------------
    draw (tickData, blockData) {
	this.drawTitle();
	this.drawChromosomes();
	this.drawBlocks(blockData);
	this.drawTicks(tickData);
    }

    // ---------------------------------------------
    drawChromosomes () {
	let self = this;
	let gdata = this.app.rGenome;

	//
	gdata.xscale = d3.scale.ordinal()
	     .domain(gdata.chromosomes.map(function(x){return x.name;}))
	     .rangePoints([0, this.width], 0.5);
	gdata.yscale = d3.scale.linear()
	     .domain([1,gdata.maxlen])
	     .range([0, this.height]);

	gdata.chromosomes.forEach(chr => {
	    var sc = d3.scale.linear()
		.domain([1,chr.length])
		.range([0, gdata.yscale(chr.length)]);
	    chr.brush = d3.svg.brush().y(sc)
	       .on("brushstart", chr => this.brushstart(chr))
	       .on("brushend", () => this.brushend());
	  }, this);

	// Group to hold synteny blocks. Want this first so everything else overlays it.
	let sygp = this.svgMain.selectAll('g[name="synBlocks"]').data([0]);
	sygp.enter().append("g").attr("name","synBlocks");
	sygp.exit().remove();

	// Chromosome backbones (lines)
	// group to hold em
	let bbgp = this.svgMain.selectAll('g[name="backbones"]').data([0]);
	bbgp.enter().append("g").attr("name","backbones");
	bbgp.exit().remove();
        // now the lines
	let xf = function(d){return self.bwidth+gdata.xscale(d.name);};
	let ccels = bbgp.selectAll('line.chr')
	  .data(gdata.chromosomes, function(x){return x.name;});
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
	  .attr("y2", function(d){return gdata.yscale(d.length);})
	    ;

	// Chromosome labels
	let clgp = this.svgMain.selectAll('g[name="labels"]').data([0]);
	clgp.enter().append("g").attr("name","labels");
	clgp.exit().remove();
	//
	let labels = clgp.selectAll('.chrlabel')
	  .data(gdata.chromosomes, function(x){return x.name;});
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
	let brgp = this.svgMain.selectAll('g[name="brushes"]').data([0]);
	brgp.enter().append("g").attr("name","brushes");
	brgp.exit().remove();
	//
	let brushes = brgp.selectAll("g.brush")
	    .data(gdata.chromosomes, function(x){return x.name;});
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
	    .attr('transform', function(d){return 'translate('+gdata.xscale(d.name)+')';})
	    .each(function(d){d3.select(this).call(d.brush);})
	    ;
    }

    // ---------------------------------------------
    // Args: 
    //    title (string) main title. optional. if not provided, will use name of current ref genome
    //    subtitle (string) optional subtitle.
    drawTitle (title, subtitle) {
	// Ref genome label
	let ttl = this.svgMain.selectAll("text.title")
	    .data([this.app.rGenome]);
	ttl.enter().append("text").attr("class","title");
	ttl.text(s => title || s.label)
	    .attr("x", this.width/2)
	    .attr("y", this.height - 20);
	let sttl = ttl.selectAll("tspan.subtitle")
	    .data([" " + (subtitle || "")]);
	sttl.enter().append("tspan")
	    .attr("class","subtitle");
	sttl.exit().remove();
	sttl.text( t => t )
    }

    // ---------------------------------------------
    // Draws the outlines of synteny blocks of the ref genome vs.
    // the given genome.
    // Passing null erases all synteny blocks.
    // Args:
    //    blockData == { ref:Genome, comp:Genome, blocks: list of synteny blocks }
    drawBlocks (blockData) {
	//
	this.currBlocks = blockData;
	//
	// group to hold the synteny block rectangles
        let bgrp = this.svg
	    .select('g[name="synBlocks"]')
	    .datum(blockData);
	
	if (!blockData) {
	    bgrp.selectAll("rect.sblock").remove();
	    return;
	}

	// now the rects
	let rects = bgrp.selectAll("rect.sblock")
	    .data(d => d.blocks, b => b.blockId);
	rects.enter().append("rect")
	    .attr("class", "sblock")
	    ;
	rects.exit().remove();
	//
	let bwidth = 10;
	rects
	    .attr("x", b => this.getX(b.fromChr) + (b.ori === "+" ? bwidth : 0))
	    .attr("y", b => this.getY(b.fromStart))
	    .attr("width", bwidth)
	    .attr("height", b => this.getY(b.fromEnd - b.fromStart + 1))
	    .classed("inversion", b => b.ori === "-")
	    .classed("translocation", b => b.fromChr !== b.toChr)
	    ;

	let subt = `vs ${blockData.comp.label}`;
	this.drawTitle(null, blockData.ref===blockData.comp ? null : subt);
    }

    // ---------------------------------------------
    drawTicks (data) {
	this.currTicks = data;
	let gdata = this.app.rGenome;
	// feature tick marks
	let tickLength = 10;
	if (!data) {
	    this.svgMain.selectAll("line.feature").remove();
	    return;
	}
        let feats = this.svgMain.selectAll("line.feature")
	    .data(data||[], d => d.mgiid);
	let nfs = feats.enter()
	    .append("line")
	    .attr("class","feature");
	feats.attr("x1", d => gdata.xscale(d.chr) + (d.strand === "-1" ? 0 : tickLength))
	feats.attr("y1", d => gdata.yscale(d.start))
	feats.attr("x2", d => gdata.xscale(d.chr)+ (d.strand === "-1" ? 0 : tickLength) + tickLength)
	feats.attr("y2", d => gdata.yscale(d.start))
	//
	feats.exit().remove()
    }

} // end class GenomeView

// ---------------------------------------------
class ZoomView extends SVGView {
    constructor (id, width, height, app) {
      super(id,width,height, app);
      //
      this.minSvgHeight = 250;
      this.stripHeight = 36;
      this.blockHeight = 40;
      this.topOffset = 45;
      this.featHeight = 6;	// height of a rectangle representing a feature
      this.laneGap = 2;	        // space between swim lanes
      this.laneHeight = this.featHeight + this.laneGap;
      this.stripHeight = 70;    // height per genome in the zoom view
      //
      this.coords = null;	// curr zoom view coords { chr, start, end }
      this.hiFeats = {};	// IDs of Features we're highlighting. May be mgpid  or mgiId
      this.svgMain.append("g")
        .attr("class","fiducials");
      this.svgMain.append("g")
        .attr("class","strips");
      // so user can go back
    }
    //----------------------------------------------
    update (coords) {
	let c = this.coords = coords;
	d3.select("#zoomCoords")[0][0].value = formatCoords(c.chr, c.start, c.end);
	d3.select("#zoomWSize")[0][0].value = Math.round(c.end - c.start + 1)
	//
        let mgv = this.app;
	// when the translator is ready, we can translate the ref coords to each genome and
	// issue requests to load the features in those regions.
	mgv.showBusy(true);
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
		fChr   : c.chr,
		fStart : c.start,
		fEnd   : c.end,
		ori    : "+",
		blockId: mgv.rGenome.name
		}]));
	    // Add a request for each comparison genome, using translated coordinates. 
	    mgv.cGenomes.forEach(cGenome => {
		let ranges = mgv.translator.translate( mgv.rGenome, c.chr, c.start, c.end, cGenome );
		promises.push(mgv.featureManager.getFeatures(cGenome, ranges))
	    });
	    // when everything is ready, call the draw function
	    Promise.all(promises).then( data => {
	        mgv.zoomView.draw(data);
		mgv.showBusy(false);
            });
	});

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
	      let bb = this.svgMain.select(`.zoomStrip[name="${g.name}"] .zoomBlock[name="${rr.blockId}"] .brush`)
	      bb.each( function(b) {
	          b.brush.extent([rr.start, rr.end]);
		  d3.select(this).call(b.brush);
	      });
	  });
      });
    }
    bbEnd () {
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
	//
	this.svgMain.selectAll('.zoomStrip')
	    .classed("highlighted", d => d.genome === g);
	this.svgMain.selectAll('.zoomStripShadow')
	    .classed("highlighted", d => d.genome === g);
	//
	let ref = this.app.rGenome;
	let blks = g === ref ? [] : this.app.translator.getBlocks(ref, g);
	//
	this.currentHLG = g;
	this.app.genomeView.drawBlocks({ ref: ref, comp: g, blocks:blks });
    }

    //----------------------------------------------
    // Draws the zoom view panel with the given data.
    // Data is structured as follows:
    //  - data is a list of items, one per strip to be displayed. Item[0] is data for the ref genome.
    //    Items[1+] are data for the comparison genome.
    //  - each strip item is an object containing a genome and a list of blocks. Item[0] always has 
    //    a single block.
    //  - each block is an object containing a chromosome, start, end, orientation, etc, and a list of features.
    //  - each feature has chr,start,end,strand,type,biotype,mgpid
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

	// The title on the zoomview position controls
	d3.select("#zoomView .zoomCoords label")
	    .text(data[0].genome.label + " coords");
	
	// x-axis.
	this.axisFunc = d3.svg.axis()
	    .scale(this.xscale)
	    .orient("top")
	    .outerTickSize(0)
	    .ticks(5)
	    ;
	// axis container
	let axis = this.svgMain.selectAll("g.axis")
	    .data([this]);
	axis.enter().append("g").attr("class","axis");
	// inject the axis elts
	axis.call(this.axisFunc);

	// strips, one per genome
	let zrs = this.svgMain.select("g.strips")
		  .selectAll("g.zoomStrip")
		  .data(data, d => d.genome.name);
	let newZrs = zrs.enter()
	    .append("g")
		.attr("class", "zoomStrip")
		.attr("name", d => d.genome.name)
		.on("click", function (g) {
		    d3.event.stopPropagation();
		    self.highlightStrip(g.genome, this);
		});
	//
	zrs.exit().remove();
	//
	newZrs.append("g").attr("class","layer0");
	newZrs.append("g").attr("class","layer1");
	newZrs.append("g").attr("class","layer2");
	//
        let zrFids     = zrs.select(".layer0"); // underlay (fiducials)
        let zrFeats    = zrs.select(".layer1"); // main (features)
        let zrTop      = zrs.select(".layer2");	// overlay (axes, brushes)

	// reset the svg size based on number of strips
	d3.select(this.selector)
	    .attr("height", Math.max(this.minSvgHeight, this.stripHeight*(data.length+1)));

	// y-coords for each genome in the zoom view
	data.forEach( (d,i) => d.genome.zoomY = this.topOffset + (i * this.stripHeight) );
	//
	// genome labels. Put them in the view's fiducial layer
	let gLabels = this.svgMain.select("g.fiducials")
	    .selectAll("text.genomeLabel")
	    .data(data, d => d.genome.name);
	gLabels.enter().insert("text").attr("class","genomeLabel");
	gLabels.exit().remove();
	gLabels
	    .attr("x", 0)
	    .attr("y", d => d.genome.zoomY - (this.blockHeight/2 + 3))
	    .attr("font-family","sans-serif")
	    .attr("font-size", 10)
	    .text(d => d.genome.label);

	// feature blocks
	let fbs = zrFeats.selectAll(".zoomBlock")
	    .data(d => d.blocks, d => d.blockId);
	let newFbs = fbs.enter().append("g")
	    .attr("class", b => "zoomBlock" + (b.ori==="+" ? " plus" : " minus"))
	    .attr("name", b=>b.blockId);
	//
	fbs.exit().remove();

	// fiducial blocks
	let fids = zrFids.selectAll(".zoomBlock")
	    .data(d => d.blocks, d => d.blockId);
	let newFids = fids.enter().append("g")
	    .attr("class", b => "zoomBlock" + (b.ori==="+" ? " plus" : " minus"))
	    .attr("name", b=>b.blockId);
	//
	fids.exit().remove();
	// rectangle for the whole block
	newFids.append("rect").attr("class", "block")
	    .on("click", ()=> d3.event.stopPropagation());
	// the axis line
	newFids.append("line").attr("class","axis") ;
	// label
	newFids.append("text")
	    .attr("class","blockLabel") ;
	// brush
	newFids.append("g").attr("class","brush");


	// To line each chunk up with the corresponding chunk in the reference genome,
	// create the appropriate x scales.
	let offset = []; // offset of start  position of next block, by strip index (0===ref)
	fbs.each( (b,i,j) => { // b=block, i=index within strip, j=strip index
	    // This one scales each comp block to be the same width as its ref range.
	    // let x1 = this.xscale(b.fStart);
	    // let x2 = this.xscale(b.fEnd);
	    //
	    // This one lets each comp block be its 'actual' width
	    let fsx = this.xscale(b.fStart);
	    let x1 = i === 0 ? fsx : Math.max(fsx, offset[j]);
	    let x2 = x1 + ppb * (b.end - b.start + 1)
	    let delta = 0; // a hook for adjusting range (for line-em-up function)
	    b.xscale = d3.scale.linear().domain([b.start, b.end]).range([x1+delta, x2+delta]);
	    offset[j] = x2+2;
	});

	// sblock label
	fids.select("text.blockLabel")
	    .text( b => b.chr );

	// shadow box for the sblock
	fids.select("rect.block")
	  .attr("x",     b => b.xscale(b.start))
	  .attr("y",     b => b.genome.zoomY - this.blockHeight / 2)
	  .attr("width", b=>b.xscale(b.end)-b.xscale(b.start))
	  .attr("height",this.blockHeight);

	// shadow box for the strip
	let zsRects = this.svgMain.select("g.fiducials")
	    .selectAll("rect.zoomStripShadow")
	    .data(data, d => d.genome.name);
	zsRects.enter().append("rect").attr("class","zoomStripShadow");
	zsRects.exit().remove();
	zsRects
	    .attr("x", -15)
	    .attr("y", d => d.genome.zoomY - this.blockHeight / 2)
	    .attr("width", 15)
	    .attr("height", this.blockHeight)
	    ;

	// axis line
	fids.select("line.axis")
	    .attr("x1", b => b.xscale.range()[0])
	    .attr("y1", b => b.genome.zoomY)
	    .attr("x2", b => b.xscale.range()[1])
	    .attr("y2", b => b.genome.zoomY)
	    ;

	// brush
	fids.select(".brush")
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

	fids.select(".brush")
	    .attr("transform", b => `translate(0,${b.genome.zoomY + this.blockHeight / 2})`);

	// chromosome label 
	fids.select("text.blockLabel")
	    .attr("x", b => (b.xscale(b.start) + b.xscale(b.end))/2 )
	    .attr("y", b => b.genome.zoomY + this.blockHeight / 2 + 10);

	// features
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
	let feats = fbs.selectAll(".feature")
	    .data(d=>d.features.filter(filterDrawn), d=>d.mgpid);
	feats.exit().remove();
	//
	let fSelect = function (f, shift) {
	    let id = f.mgiid || f.mgpid;
	    if (shift) {
		if (self.hiFeats[id])
		    delete self.hiFeats[id]
		else
		    self.hiFeats[id] = id;
	    }
	    else {
		self.hiFeats = {};
		self.hiFeats[id] = id;
	    }
	};
	//
	let fClickHandler = function(f){
	    d3.event.stopPropagation();
	    fSelect(f, d3.event.shiftKey);
	    self.highlight();
	    self.app.callback();
	};
	//
	let fMouseOverHandler = function(f) {
		if (d3.event.altKey) fSelect(f, d3.event.shiftKey);
		self.highlight(this);

		if (self.timeout) window.clearTimeout(self.timeout);
		self.timeout = window.setTimeout(function(){ self.app.callback(); }, 1000);
	}
	let fMouseOutHandler = function(f) {
		self.highlight();
	}
	let newFeats = feats.enter().append("rect")
	    .attr("class", f => "feature" + (f.strand==="-" ? " minus" : " plus"))
	    .attr("name", f => f.mgpid)
	    .style("fill", f => self.app.cscale(f.getMungedType()))
	    .on("mouseover", fMouseOverHandler)
	    .on("mouseout", fMouseOutHandler)
	    .on("click", fClickHandler)
	    ;

	// draw the rectangles
	let fBlock = function (featElt) {
	    let blkElt = featElt.parentNode;
	    return blkElt.__data__;
	}
	feats
	  .attr("x", function (f) { return fBlock(this).xscale(f.start) })
	  .attr("width", function (f) { return fBlock(this).xscale(f.end)-fBlock(this).xscale(f.start)+1 })
	  .attr("y", function (f) {
	       if (f.strand == "+")
		   return f.genome.zoomY - self.laneHeight*f.lane;
	       else
		   // f.lane is negative for "-" strand
	           return f.genome.zoomY - self.laneHeight*f.lane - self.featHeight; 
	       })
	  .attr("height", this.featHeight)
	  ;
	
	//
	this.app.facetManager.applyAll();

	// We need to let the view render before doing the highlighting, since it depends on
	// the positions of rectangles in the scene.
	window.setTimeout(this.highlight.bind(this), 50);
    };

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
	// current's feature
	let currFeat = current ? (current instanceof Feature ? current : current.__data__) : null;
	// create local copy of hiFeats, with current feature added
	let hiFeats = Object.assign({}, this.hiFeats);
	if (currFeat) {
	    hiFeats[currFeat.id] = currFeat.id;
	    //if (currFeat.mgiid)
		//console.log(this.app.featureManager.getCachedFeaturesByMgiId(currFeat.mgiid));
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
	    // want a polygon between each successive pair of items
	    // Add a class ("current") for the polygons associated with the mouseover feature so they
	    // can be distinguished from others.
	    let pairs = rects.map((r, i) => [r,rects[i+1]]);
	    data.push({ fid: k, rects: pairs, cls: (currFeat && currFeat.id === k ? 'current' : '') });
	}
	this.drawFiducials(data, currFeat);
	this.app.updateFeatureDetails(currFeat);
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

	// put fiducial marks in their own group 
	let fGrp = this.svgMain.select("g.fiducials")
	    .classed("hidden", false);

	// Bind first level data to "featureMarks" groups
	let ffGrps = fGrp.selectAll("g.featureMarks")
	    .data(data, d => d.fid);
	ffGrps.enter().append("g")
	    .attr("name", d => d.fid);
	ffGrps.exit().remove();
	//
	ffGrps.attr("class",d => "featureMarks " + (d.cls || ""))

	// Draw feature labels. Each label is drawn once, above the first rectangle in its list.
	let labels = ffGrps.selectAll('text.featLabel')
	    .data(d => [{ fid: d.fid, rect: d.rects[0][0] }]);
	    // .data(d => d.rects.map( function (r) { return { fid: d.fid, rect: r[0] } }));
	labels.enter().append('text').attr('class','featLabel');
	labels.exit().remove();
	labels
	  .attr("x", d => parseInt(d.rect.getAttribute("x")) + parseInt(d.rect.getAttribute("width"))/2 )
	  .attr("y", d => d.rect.__data__.genome.zoomY - this.blockHeight/2 - 3)
	  .text(d => {
	       let f = d.rect.__data__;
	       let sym = f.symbol || f.mgpid;
	       return sym;
	  });

	// Put a rectangle behind each label (as a background)
	let lblBoxData = labels.map(lbl => lbl[0].getBBox())
	let lblBoxes = ffGrps.selectAll('rect.featLabelBox')
	    .data((d,i) => [lblBoxData[i]]);
	lblBoxes.enter().insert('rect',':first-child').attr('class','featLabelBox');
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
	this.svgMain.select("g.fiducials")
	    .classed("hidden", true);
    }
    //----------------------------------------------
    // Translates each strip in the x-dimension as needed so that the
    // rectangles for the given feature line up.
    // The translation is sticky.
    // 
    alignOn (feat) {
        // get the feature's rect
	let fr = this.svgMain.select(`rect.feature[name="${feat.mgpid}"]`);
	let frs = this.svgMain.selectAll("rect.feature")
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
	mgv.zoomView.svgMain.select("g.strips").selectAll('rect.feature')
	    .style("display", f => this.test(f) ? show : hide);
    }
} // end class FacetManager

// ---------------------------------------------
class MGVApp {
    constructor (cfg) {
	//
	//console.log("MGVApp. cfg=", cfg);
	let self = this;
	//
	this.callback = (cfg.oncontextchange || function(){});
	//
	this.name2genome = {}; // map from genome name -> genome data obj
	this.label2genome = {}; // map from genome label -> genome data obj
	//
	this.rGenome = null; // thereference genome
	this.cGenomes = []; // comparison genomes
	this.coords = { chr:"1", start:1, end:10000000 }; // current coordinates
	//
	this.dur = 250;         // anomation duration
	this.defaultZoom = 2;	// multiplier of current range width. Must be >= 1. 1 == no zoom.
				// (zooming in uses 1/this amount)
	this.defaultPan  = 0.15;// fraction of current range width
	//
	this.allGenomes = []; // list of all genome names
	//
	this.genomeView = new GenomeView("genomeView", 800, 250, this);
	this.zoomView   = new ZoomView  ("zoomView",   800, 250, this);
	this.cscale = d3.scale.category10().domain([
	    "protein_coding_gene",
	    "pseudogene",
	    "ncRNA_gene",
	    "gene_segment",
	    "other_gene",
	    "other_feature_type"
	]);
	//
	this.listManager    = new ListManager();
	this.updateLists();
	//
	this.translator     = new BTManager(this);
	this.featureManager = new FeatureManager(this);
	this.auxDataManager = new AuxDataManager(this);

	// Create context menu. Only one command so far...
	this.initContextMenu([{
            label: "MGI SNPs", 
	    icon: "open_in_new",
	    tooltip: "Get SNPs from MGI for the current strains in the current region. (Some strains not available.)",
	    handler: ()=> this.linkToMgiSnpReport()
	}]);
	// Button: Menu in zoom view
	d3.select("#zoomView .menu > .button")
	  .on("click", function () {
	      // show context menu at mouse event coordinates
	      d3.event.stopPropagation();
	      d3.event.preventDefault();
	      let cx = d3.event.clientX;
	      let cy = d3.event.clientY;
	      let bb = d3.select(this)[0][0].getBoundingClientRect();
	      self.showContextMenu(cx-bb.left,cy-bb.top);
	  });
	// Background click in zoom view = unselect all.
	d3.select("#zoomView svg")
	  .on("click", () => {
	      d3.event.stopPropagation();
	      this.hideContextMenu();
	      this.zoomView.hiFeats = {};
	      this.zoomView.highlight();
	  });

	// Button: Gear icon to show/hide left column
	d3.select("#header > .gear.button")
	    .on("click", () => {
	        d3.event.stopPropagation();
	        let lc = d3.select("#mgv > .leftcolumn");
		lc.classed("closed", () => ! lc.classed("closed"));
		this.resize()
	    });
	
	// Button: create list from current selection
	d3.select('.mylists .button[name="newfromselection"]')
	    .on("click", () => {
	        d3.event.stopPropagation();
		let ids = Object.keys(this.zoomView.hiFeats);
		if (ids.length === 0) {
		    alert("Nothing selected.");
		    return;
		}
		this.listManager.createOrUpdate("selected features", ids);
		this.updateLists();
	    });
	// Button: create list by combining others
	d3.selectAll('.mylists [name="newfromlistop"] i')
	    .on("click", () => {
	        d3.event.stopPropagation();
		console.log("NEW LIST")
	    });
	//
	d3.select('.mylists .button[name="purge"]')
	    .on("click", () => {
	        d3.event.stopPropagation();
		if (this.listManager.getNames().length === 0) {
		    alert("No lists.");
		    return;
		}
	        if (window.confirm("Delete all lists. Are you sure?")) {
		    this.listManager.purge();
		    this.updateLists();
		}
	    });

	// Facets
	//
	this.facetManager = new FacetManager(this);

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

	// Initial coordinates
	let startingCoords = formatCoords(cfg);
	d3.select("#zoomCoords")
	    .call(zcs => zcs[0][0].value = startingCoords || "1:10000000..20000000")
	    .on("change", function () {
		let coords = parseCoords(this.value);
		if (! coords) {
		    alert("Please enter a coordinate range formatted as 'chr:start..end'. For example, '5:10000000..50000000'.");
		    this.value = "";
		    return;
		}
		self.setContext(coords);
	    });
	// 
	d3.select("#zoomWSize")
	    .on("change", function() {
	        let ws = parseInt(this.value);
		let c = self.zoomView.coords;
		if (isNaN(ws) || ws < 100) {
		    alert("Invalid window size. Please enter an integer >= 100.");
		    this.value = Math.round(c.end - c.start + 1);
		}
		else {
		    let mid = (c.start + c.end) / 2;
		    let news = Math.round(mid - ws/2);
		    let newe = news + ws - 1;
		    self.setContext({
		        chr: c.chr,
			start: news,
			end: newe

		    });
		}
	    });
	//
	d3.selectAll(".button.collapse")
	    .on("click.default", function () {
		let p = d3.select(this.parentNode);
		p.classed("closed", ! p.classed("closed"));
	    });
	d3.select("#featureDetails .button.collapse")
	    .on("click.extra", () => this.updateFeatureDetails());

	// zoom controls
	d3.select("#zoomOut").on("click",     () => { d3.event.stopPropagation(); this.zoom(this.defaultZoom) });
	d3.select("#zoomIn") .on("click",     () => { d3.event.stopPropagation(); this.zoom(1/this.defaultZoom) });
	d3.select("#zoomOutMore").on("click", () => { d3.event.stopPropagation(); this.zoom(2*this.defaultZoom) });
	d3.select("#zoomInMore") .on("click", () => { d3.event.stopPropagation(); this.zoom(1/(2*this.defaultZoom)) });

	// pan controls
	d3.select("#panLeft") .on("click",     () => { d3.event.stopPropagation(); this.pan(-this.defaultPan) });
	d3.select("#panRight").on("click",     () => { d3.event.stopPropagation(); this.pan(+this.defaultPan) });
	d3.select("#panLeftMore") .on("click", () => { d3.event.stopPropagation(); this.pan(-5*this.defaultPan) });
	d3.select("#panRightMore").on("click", () => { d3.event.stopPropagation(); this.pan(+5*this.defaultPan) });

	// initial highlighted features 
	(cfg.highlight || []).forEach(h => this.zoomView.hiFeats[h]=h);

	// ------------------------------
	// ------------------------------
	// Query box
	d3.select("#searchterm").on("change", function () {
	    let term = this.value;
	    this.value = "";
	    let searchType  = d3.select("#searchtype")[0][0].value;
	    let lstName = term;
	    d3.select("#findgenes").classed("busy",true);
	    self.auxDataManager[searchType](term)
	      .then(feats => {
		  d3.select("#findgenes").classed("busy",false);
		  feats.forEach(f => self.zoomView.hiFeats[f.mgiid] = f.mgiid);
		  self.listManager.createOrUpdate(lstName, feats.map(f => f.primaryIdentifier))
		  self.updateLists();
	      });
	})
	// ------------------------------
	// ------------------------------

	// Things are all wired up. Now lets get some data.
	// Start with the file of all the genomes.
	d3tsv("./data/genomeList.tsv").then(function(data){
	    // create Genome objects from the raw data.
	    this.allGenomes   = data.map(g => new Genome(g));
	    // build a name->Genome index
	    this.name2genome  = this.allGenomes
	        .reduce((acc,g) => { acc[g.name] = g; return acc; }, {});
	    // build a label->Genome index
	    this.label2genome = this.allGenomes
	        .reduce((acc,g) => { acc[g.label] = g; return acc; }, {});

	    // Initializes the comparison genomes <select> list. 
	    // The main thing
	    // is to be sure the currently selected ref genome is not 
	    // in the comparison genome list.
	    function initCompGenomesList(selected) {
		let rg = d3.select("#refGenome").property("selectedOptions")[0];
		let cgs = self.allGenomes.filter(g => g.label !== rg.innerText);
		initOptList("#compGenomes", cgs, g=>g.name, g=>g.label, true, selected );
	    }

	    // initialize the ref and comp genome option lists
	    initOptList("#refGenome",   this.allGenomes, g=>g.name, g=>g.label, false, g => g.label === cfg.ref);
	    initCompGenomesList(function (g) { 
	        return cfg.comps.indexOf(g.label) >= 0
	    });
	    //
	    d3.select("#refGenome").on("change", () => {
		// whenever the user changes the reference genome, reinitialize the 
		// comparison genomes list and redraw
		initCompGenomesList();
	        this.draw();
	    });
	    d3.select("#compGenomes").on("change", () => this.draw());
	    //
	    // Preload all the chromosome files for all the genomes
	    let cdps = this.allGenomes.map(g => d3tsv(`./data/genomedata/${g.name}-chromosomes.tsv`));
	    return Promise.all(cdps);
	}.bind(this))
	.then(function (data) {

	    this.processChromosomes(data);

	    // FINALLY! We are ready to draw the initial scene.
	    this.draw();

	    // the first time we draw, resize to the dimensions passed in the config
	    this.resize( cfg.width, cfg.height );

	}.bind(this));
    }
    //----------------------------------------------
    showBusy (isBusy) {
        d3.select("#header > .gear.button")
	    .classed("rotating", isBusy);
    }
    //----------------------------------------------
    draw () {
	let ref = d3.select("#refGenome")[0][0].value;
	let comps = [];
	for(let x of d3.select("#compGenomes")[0][0].selectedOptions){
	    comps.push(x.value);
	}
	let c = parseCoords(d3.select("#zoomCoords")[0][0].value);
	this.setContext({ref, comps, chr:c.chr, start:c.start, end: c.end});
    }
    //----------------------------------------------
    setRefGenome (g) {
	//
	if (!g) return false;
	//
	let rg = this.name2genome[g] || this.label2genome[g];
	if (rg && rg !== this.rGenome){
	    // change the ref genome
	    this.rGenome = rg;
	    d3.selectAll("#refGenome option")
	        .property("selected",  gg => (gg.label === g  || null));
	    this.genomeView.draw();
	    return true;
	}
	return false;
    }
    //----------------------------------------------
    // Sets or returns
    setCompGenomes (glist) {
        //
        if (!glist) return false;
	// 
	let cgs = [];
	for( let x of glist ) {
	    let cg = this.name2genome[x] || this.label2genome[x];
	    cg && cgs.push(cg);
	}
	let cgns = cgs.map( cg => cg.label );
	d3.selectAll("#compGenomes option")
	        .property("selected",  gg => cgns.indexOf(gg.label) >= 0);
	//
	// compare contents of cgs with the current cGenomes.
	if (same(cgs, this.cGenomes)) return false;
	//
	this.cGenomes = cgs;
	return true;
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
        let c = this.zoomView.coords;
        return {
	    ref : this.rGenome.label,
	    comps: this.cGenomes.map(g => g.label),
	    chr: c.chr,
	    start: c.start,
	    end: c.end,
	    highlight: Object.keys(this.zoomView.hiFeats)
	}
    }
    //----------------------------------------------
    // Sets the current context from the config object
    //
    setContext (cfg) {

	//console.log("SET CONTEXT", cfg);


	// ref genome
	let changedRg = this.setRefGenome(cfg.ref);
	// comp genomes
	let changedCg = this.setCompGenomes(cfg.comps);

	// coordinates
	let changedCoords;
	let coords = this.sanitizeCoords({ chr: cfg.chr, start: cfg.start, end: cfg.end });
	if (coords) {
	    this.coords = coords;
	    changedCoords = true;
	}
	else {
	    coords = this.coords;
	    changedCoords = false;
	}

	// highlighted features
	let changedHl = this.setHighlight(cfg.highlight);
	
	// 
	let changed = changedRg || changedCg || changedCoords || changedHl;

	//
	this.genomeView.redraw();
	this.genomeView.setBrushCoords(coords);
	this.zoomView.update(coords)
	if (changed) {
	    this.callback();
	}
	//
    }
    //----------------------------------------------
    resize (width, height) {
	width = width || this.lastWidth
	height= height || this.lastHeight;
        this.genomeView.fitToWidth(width-24);
        this.zoomView.fitToWidth(width-24);
	this.draw();
	this.lastWidth = width;
	this.lastHeight = height;
    }
    //----------------------------------------------
    // Returns the current context as a parameter string
    // Current context = ref genome + comp genomes + current range (chr,start,end)
    getParamString () {
	let c = this.getContext();
        let ref = `ref=${c.ref}`;
        let comps = `comps=${c.comps.join("+")}`;
	let coords = `chr=${c.chr}&start=${c.start}&end=${c.end}`;
	let hls = `highlight=${c.highlight.join("+")}`;
	return `${ref}&${comps}&${coords}&${hls}`;
    }
    //----------------------------------------------
    //
    updateFeatureDetails (f) {
	// if called with no args, update using the previous feature
	f = f || this.lastFeature;
	if (!f) {
	   // fallback. take the first highlighted.
	   let r = this.zoomView.svgMain.select("rect.feature.highlight")[0][0];
	   // fallback. take the first feature
	   if (!r) r = this.zoomView.svgMain.select("rect.feature")[0][0];
	   if (r) f = r.__data__;
	}
	// remember
        if (!f) throw "Cannot update feature details. No feature.";
	this.lastFeature = f;

	// list of features to show in details area.
	// the given feature and all equivalents in other genomes.
	let flist = [f];
	if (f.mgiid) {
	    flist = this.featureManager.getCachedFeaturesByMgiId(f.mgiid);
	}
	// Got the list. Now order it the same as the displayed genomes
	// build index of genome name -> feature in flist
	let ix = flist.reduce((acc,f) => { acc[f.genome.name] = f; return acc; }, {})
	let genomeOrder = ([this.rGenome].concat(this.cGenomes));
	flist = genomeOrder.map(g => ix[g.name] || null);
	//
	let colHeaders = [
	    // columns headers and their % widths
	    ["Genome"     ,10],
	    ["MGP id"     ,17],
	    ["Type"       ,12.5],
	    ["BioType"    ,12.5],
	    ["Coords"     ,18],
	    ["Length"     ,10],
	    ["MGI id"     ,10],
	    ["MGI symbol" ,10]
	];
	//
	let fds = d3.select('#featureDetails');
	// In the closed state, only show the header and the row for the passed feature
	if (fds.classed('closed'))
	    flist = flist.filter( (ff, i) => ff === f );
	// Draw the table
	let t = d3.select('#featureDetails > table');
	let rows = t.selectAll('tr').data( [colHeaders].concat(flist) );
	rows.enter().append('tr')
	  .on("mouseenter", (f,i) => i !== 0 && this.zoomView.highlight(f, true))
	  .on("mouseleave", (f,i) => i !== 0 && this.zoomView.highlight());
	      
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
	    //return cellData.map( d => `<td>${d}</td>` ).join('');
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

    //----------------------------------------------
    updateLists () {
	self = this;
        let lists = this.listManager.getAll();
	lists.sort( (b,a) => (new Date(a.modified)).getTime() - (new Date(b.modified)).getTime() );
	let items = d3.select('.mylists [name="lists"]').selectAll(".listInfo")
	    .data(lists);
	let newitems = items.enter().append("div")
	    .attr("class","listInfo flexrow");
	newitems.append("span").attr("name","name").attr("contenteditable", "true");
	newitems.append("span").attr("name","size");
	newitems.append("span").attr("name","date");

	newitems.append("i").attr("name","delete")
	    .attr("class","material-icons button")
	    .attr("title","Delete this list.")
	    .text("highlight_off");

	items
	    .attr("name", lst=>lst.name)
	items.select('span[name="name"]')
	    .text(lst => lst.name)
	    .on("focus", function (lst) {
		var range = document.createRange();
		range.setStart( this, 0 );
		range.setEnd( this, 1 )
		window.getSelection().removeAllRanges();
		window.getSelection().addRange(range);
	    })
	    .on("blur", function (lst) {
		// change the list's name 
		let newname = this.innerHTML;
		if (newname !== lst.name) {
		    self.listManager.updateList(lst.name, newname);
		    self.updateLists();
		}
	    });
	items.select('span[name="date"]').text(lst => {
	    let md = new Date(lst.modified);
	    let d = `${md.getFullYear()}-${md.getMonth()+1}-${md.getDate()} ` 
	          + `:${md.getHours()}.${md.getMinutes()}.${md.getSeconds()}`;
	    return d;
	});
	items.select('span[name="size"]').text(lst => lst.ids.length);
	items.select('.button[name="delete"]')
	    .on("click", lst => { d3.event.stopPropagation(); this.listManager.deleteList(lst.name); this.updateLists();});
	//
	items.exit().remove();
    }

    //----------------------------------------------
    sanitizeCoords(coords) {
	if (typeof(coords) === "string") 
	    coords = parseCoords(coords);
	let chromosome = this.rGenome.chromosomes.filter(c => c.name === coords.chr)[0];
	if (! chromosome) return null;
	if (coords.start > coords.end) {
	    let tmp = coords.start; coords.start = coords.end; coords.end = tmp;
	}
	coords.start = Math.max(1, Math.floor(coords.start))
	coords.end   = Math.min(chromosome.length, Math.floor(coords.end))
        return coords;
    }

    //----------------------------------------------
    // Zooms in/out by factor. New zoom width is factor * the current zoom width.
    // Factor > 1 zooms out, 0 < factor < 1 zooms in.
    zoom (factor) {

	let len = this.coords.end - this.coords.start + 1;
	let newlen = Math.round(factor * len);
	let x = (this.coords.start + this.coords.end)/2;
	let newstart = Math.round(x - newlen/2);
	this.setContext({ chr: this.coords.chr, start: newstart, end: newstart + newlen - 1 });
    }

    //----------------------------------------------
    // Pans the view left or right by factor. The distance moved is factor times the current zoom width.
    // Negative values pan left. Positive values pan right. (Note that panning moves the "camera". Panning to the
    // right makes the objects in the scene appear to move to the left, and vice versa.)
    //
    pan (factor, animate) {
	let width = this.coords.end - this.coords.start + 1;
	let panDist = factor * (this.zoomView.xscale.range()[1]);
	let d = Math.round(factor * width);
	let ns;
	let ne;
	if (d < 0) {
	    ns = Math.max(1, this.coords.start+d);
	    ne = ns + width - 1;
	}
	else if (d > 0) {
	    let chromosome = this.rGenome.chromosomes.filter(c => c.name === this.coords.chr)[0];
	    ne = Math.min(chromosome.length, this.coords.end+d)
	    ns = ne - width + 1;
	}
	// this probably doesn't belong here but for now...
	// To get a smooth panning effect: initialize the translation to the same as
	// the pan distance, but in the opposite direction...
	//this.zoomView.svg
	    //.style("transition", "transform 0s")
	    //.style("transform", `translate(${-panDist}px,0px)`);
	// ...then the zoom draw will transition the vector back to (0,0)
	this.setContext({ chr: this.coords.chr, start: ns, end: ne });
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
		d3.event.sourceEvent.stopPropagation();
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
    // Args:
    //     data (list of menuItem configs) Each config looks like {label:string, handler: function}
    initContextMenu (data) {
	let menu = d3.select("#cxtMenu");
	menu.selectAll(".menuItem").remove(); // in case of re-init
        let mitems = d3.select("#cxtMenu")
	  .selectAll(".menuItem")
	  .data(data);
	let news = mitems.enter()
	  .append("div")
	  .attr("class", "menuItem flexrow")
	  .attr("title", d => d.tooltip || null );
	news.append("label")
	  .text(d => d.label)
	  .on("click", d => {
	      d3.event.sourceEvent.stopPropagation();
	      d.handler();
	      this.hideContextMenu();
	  });
	news.append("i")
	  .attr("class", "material-icons")
	  .text( d=>d.icon );
    }

    //----------------------------------------------
    showContextMenu (x,y) {
        d3.select("#cxtMenu")
	    .classed("showing", true)
	    .style("left", `${x}px`)
	    .style("top", `${y}px`)
	    ;
    }
    //----------------------------------------------
    hideContextMenu () {
        d3.select("#cxtMenu").classed("showing", false);
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
	let csArgs = c.comps.map(g => `selectedStrains=${g}`)
	let rsArg = `referenceStrain=${c.ref}`;
	let linkUrl = `${urlBase}?${tabArg}&${searchByArg}&${chrArg}&${coordArg}&${unitArg}&${rsArg}&${csArgs.join('&')}`
	window.open(linkUrl, "_blank");
    }
} // end class MGVApp

//----------------------------------------------
//---- END CLASS DEFS --------------------------
//----------------------------------------------

// =============================================
//                    UTILS
// =============================================

// ---------------------------------------------
// (Re-)Initializes an option list.
// Args:
//   selector (string) CSS selector of the container <select> element.
//   opts (list) List of option data objects. May be simple strings. May be more complex.
//   value (function or null) Function to produce the <option> value from an opts item
//       Defaults to the identity function (x=>x).
//   label (function or null) Function to produce the <option> label from an opts item
//       Defaults to the value function.
//   multi (boolean) Specifies if the list support multiple selections. (default = false)
//   selected (function or null) Function to determine if a given option is selectd.
//       Defaults to d=>False. Note that this function is only applied to new options.
// Returns:
//   The option list in a D3 selection.
function initOptList( selector, opts, value, label, multi, selected ) {

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
    //
    os.sort( (a,b) => {
        let ta = label(a);
	let tb = label(b);
	return ta < tb ? -1 : ta > tb ? 1 : 0;
    });

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
    let abLeft = { chr:a.chr, start:a.start,                  end:Math.min(a.end, b.start-1) };
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
// Stolen from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
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
// ---------------------------------------------
function pqstring (qstring) {
    // FIXME: URLSearchParams API is not supported in all browsers. OK for development
    // but need a fallback eventually.
    let prms = new URLSearchParams(qstring);
    //
    let comps = new Set();
    let comps0 = prms.getAll("comps");
    comps0.forEach(c0 => {
        c0.split(/[, ]+/).forEach(c => c && comps.add(c));
    });
    //
    let hls = new Set();
    let hls0 = prms.getAll("highlight");
    hls0.forEach(h0 => {
        h0.split(/[, ]+/).forEach(h => h && hls.add(h));
    });
    //
    let cfg = {
	ref: prms.get("ref") || "C57BL/6J",
	comps: Array.from(comps),
	chr: prms.get("chr") || "1",
	start: parseInt(prms.get("start") || "1"),
	end: parseInt(prms.get("end") || "20000000"),
	highlight: Array.from(hls)
    };
    if (cfg.start > cfg.end) {
        let x = cfg.start; cfg.start = cfg.end; cfg.end = x;
    }
    return cfg;
}

// Behold, the MGV application object...
let mgv = null;

// The main program, wherein the app is created and wired to the browser. 
// ALL dependencies on the browser window are confined to this function.
//
function __main__ () {
    // Callback to pass into the app to register changes in context.
    // Uses the current app context to set the hash part of the
    // browser's location. This also registers the change in 
    // the browser history.
    function setHash () {
	// don't want to trigger an infinite loop here!
	// temporarily disable popstate handler
	let f = window.onpopstate;
	window.onpopstate = null;
	// now set the hash
	window.location.hash = mgv.getParamString();
	// re-enable
	window.onpopstate = f;
    }
    // Handler called when user clicks the browser's back or forward buttons.
    // Sets the app's context based on the hash part of the browser's
    // location.
    window.onpopstate = function(event) {
	let cfg = pqstring(document.location.hash.substring(1));
	mgv.setContext(cfg);
    };
    // get initial set of context params 
    let qstring = window.location.hash.substring(1);
    let cfg = pqstring(qstring);
    cfg.width = window.innerWidth;
    cfg.height= window.innerHeight;
    cfg.oncontextchange = setHash;

    // create the app
    mgv = new MGVApp(cfg);
    
    // handle resize events
    window.onresize = () => mgv.resize(window.innerWidth, window.innerHeight);
}


__main__();

// ---------------------------------------------
})();
