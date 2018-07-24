import { SVGView } from './SVGView';
import { Feature } from './Feature';
import { clip, parseCoords, formatCoords, coordsAfterTransform, removeDups } from './utils';

// ---------------------------------------------
class ZoomView extends SVGView {
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
      this.maxSBgap = 20;	// max gap allowed between blocks.
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
	      if (f instanceof Feature) {
		  fMouseOverHandler(f);
	      }
	  })
	  .on("mouseout", () => {
	      let tgt = d3.select(d3.event.target);
	      let f = tgt.data()[0];
	      if (f instanceof Feature) {
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
	    .call(zcs => zcs[0][0].value = formatCoords(this.app.coords))
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
	this.genomes = removeDups(ns).map(n=> this.app.name2genome[n] ).filter(x=>x);
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
	      let mx = d3.mouse(self.svgMain[0][0])[0];
	      let my = d3.mouse(self.svgMain[0][0])[1];
	      self.dragging.attr("transform", `translate(${mx}, ${my})`);
	      self.setGenomeYOrder(self.getGenomeYOrder());
	      self.drawFiducials();
	  })
	  .on("dragend.z", function (g) {
	      if (!self.dragging) return;
	      //
	      self.dragging.classed("dragging", false);
	      self.dragging = null;
	      self.setGenomeYOrder(self.getGenomeYOrder());
	      self.app.setContext({ genomes: self.getGenomeYOrder() });
	      window.setTimeout( self.drawFiducials.bind(self), 50 );
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
      if (Math.abs(xt[0] - xt[1]) <= 10) {
	  // User clicked. Recenter view.
	  let cc        = this.app.coords; 
	  let currWidth = cc.end - cc.start + 1;
	  let mid       = (cc.start + cc.end)/2;
          let d = (xt[0] + xt[1])/2 - mid;
	  this.app.setContext({ start: cc.start+d, end: cc.end+d });
      }
      else {
	  // User dragged. Zoom in or out.
	  this.app.setContext({ start:xt[0], end:xt[1] });
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
	d3.select("#zoomCoords")[0][0].value = formatCoords(c.chr, c.start, c.end);
	d3.select("#zoomWSize")[0][0].value = Math.round(c.end - c.start + 1)
	//
        let mgv = this.app;
	// when the translator is ready, we can translate the ref coords to each genome and
	// issue requests to load the features in those regions.
	return mgv.translator.ready().then(function(){
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
	    return Promise.all(promises)
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
	if (this.root.classed('closed'))
	    feats = feats.filter(f => f.genome === this.app.rGenome);
	let delta = coords.delta || 0;
	// compute ranges around landmark in each genome
	let ranges = feats.map(f => {
	    let flank = c.length ? (c.length - f.length) / 2 : c.flank;
	    let clength = f.genome.getChromosome(f.chr).length;
	    let w     = c.length ? c.length : (f.length + 2*flank);
	    let start = clip(Math.round(delta + f.start - flank), 1, clength);
	    let end   = clip(Math.round(start + w), start, clength)
	    let range = {
		genome:	f.genome,
		chr:	f.chr,
		start:	start,
		end:	end
	    } ;
	    if (f.genome === mgv.rGenome) {
		let c = this.app.coords = range;
		d3.select("#zoomCoords")[0][0].value = formatCoords(c.chr, c.start, c.end);
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
    update () {
	let p;
	if (this.app.cmode === 'mapped')
	    p = this.updateViaMappedCoordinates(this.app.coords);
	else
	    p = this.updateViaLandmarkCoordinates(this.app.lcoords);
	p.then( data => {
	    this.draw(data);
	});
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
		if (dx > self.maxSBgap) {
		    // Changed chr or jumped a large gap
		    pstart[j] = pend + 16;
		    bstart[j] = b.start;
		    dx = pstart[j];
		}
	    }
	    d3.select(this).attr("transform", `translate(${dx},0)`);
	    pend = dx + blen;
	});
    }

    // ------------------------------------
    mergeSblockRuns (data) {
	// -----
	// Reducer function. Will be called with these args:
	//   nblcks (list) New blocks. (current accumulator value)
	//   	A list of lists of synteny blocks.
	//   blk (synteny block) the current synteny block
	//   i (int) The iteration count.
	// Returns:
	//   list of lists of blocks
	let merger = function(nblks, b, i) {
	    let initBlk = function (bb) {
		let nb = Object.assign({}, bb);
		nb.features = bb.features.concat();
		nb.sblocks = [bb];
		nb.ori = '+';
	        return nb;
	    };
	    if (i === 0){
		nblks.push(initBlk(b));
		return nblks;
	    }
	    let lastBlk = nblks[nblks.length - 1];
	    if (b.chr !== lastBlk.chr || b.index - lastBlk.index > 2) {
	        nblks.push(initBlk(b));
		return nblks;
	    }
	    // merge
	    lastBlk.index = b.index;
	    lastBlk.end = b.end;
	    lastBlk.blockEnd = b.blockEnd;
	    lastBlk.features = lastBlk.features.concat(b.features);
	    //b.features = null;
	    lastBlk.sblocks.push(b);
	    return nblks;
	};
	// -----
        data.forEach((gdata,i) => {
	    gdata.blocks.sort( (a,b) => a.index - b.index );
	    gdata.blocks = gdata.blocks.reduce(merger,[]);
	});
	return data;
    }

    // -----------------------------------------------------
    // synteny blocks. Each zoom strip has a list of 1 or more sblocks.
    // The reference genome always has just 1. The comp genomes many have
    // 1 or more (and in rare cases, 0).
    // -----------------------------------------------------
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
        data.forEach(gData => gData.blocks = this.uniqifyBlocks(gData.blocks));
	data = this.mergeSblockRuns(data);
	return data;
    }

    //----------------------------------------------
    // Draws the zoom view panel with the given data.
    //
    draw (data) {
        data = this.mungeData(data);
	// 
	let self = this;

	let closed = this.root.classed("closed");

	// reset the svg size based on number of strips
	let totalHeight = (this.stripHeight+this.stripGap) * data.length + 20;
	this.svg
	    .attr("height", totalHeight);

	// Draw the title on the zoomview position controls
	d3.select("#zoomView .zoomCoords label")
	    .text(this.app.rGenome.label + " coords");
	
	// the reference genome block (always just 1 of these).
	let rData = data.filter(dd => dd.genome === this.app.rGenome)[0];
	let rBlock = rData.blocks[0];

	// x-scale and x-axis based on the ref genome data.
	this.xscale = d3.scale.linear()
	    .domain([rBlock.start,rBlock.end])
	    .range([0,this.width]);

        // -----------------------------------------------------
	// draw the coordinate axis
        // -----------------------------------------------------
	this.axisFunc = d3.svg.axis()
	    .scale(this.xscale)
	    .orient("top")
	    .outerTickSize(2)
	    .ticks(5)
	    .tickSize(5)
	    ;
	this.axis.call(this.axisFunc);

        // -----------------------------------------------------
	// zoom strips (one per genome)
        // -----------------------------------------------------
        let zstrips = this.stripsGrp
	        .selectAll("g.zoomStrip")
		.data(data, d => d.genome.name);
	// Create the group
	let newzs = zstrips.enter()
	        .append("g")
		.attr("class","zoomStrip")
		.attr("name", d => d.genome.name)
		.on("click", function (g) {
		    self.highlightStrip(g.genome, this);
		})
		.call(this.dragger)
		;
	// Strip label
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

	// ---- Synteny blocks ----
        let sblocks = zstrips.select('[name="sBlocks"]').selectAll('g.sBlock')
	    .data(d=>d.blocks, b => b.blockId);
	let newsbs = sblocks.enter()
	    .append("g")
	    .attr("class", b => "sBlock " + 
	        (b.ori==="+" ? "plus" : b.ori==="-" ? "minus": "confused") + 
		(b.chr !== b.fChr ? " translocation" : ""))
	    .attr("name", b=>b.index)
	    ;
	let l0 = newsbs.append("g").attr("name", "layer0");
	let l1 = newsbs.append("g").attr("name", "layer1");

	//
	this.orderSBlocks(sblocks);

	// rectangle for each synteny block
	let sbrects = sblocks.select('g[name="layer0"]').selectAll('rect.block').data(d=> {
	    d.sblocks.forEach(b=>b.xscale = d.xscale);
	    return d.sblocks
	    }, sb=>sb.index);
        sbrects.enter().append('rect')
	    .attr("class", b => "block " + 
	        (b.ori==="+" ? "plus" : b.ori==="-" ? "minus": "confused") + 
		(b.chr !== b.fChr ? " translocation" : ""))
	    ;
	sbrects
	  .attr("x",     b => b.xscale(b.flip ? b.end : b.start))
	  .attr("y",     b => -this.blockHeight / 2)
	  .attr("width", b => Math.max(4, Math.abs(b.xscale(b.end)-b.xscale(b.start))))
	  .attr("height",this.blockHeight);
	  ;
	sbrects.exit().remove();

	// the axis line
	l0.append("line").attr("class","axis");
	
	sblocks.select("line.axis")
	    .attr("x1", b => b.xscale(b.start))
	    .attr("y1", 0)
	    .attr("x2", b => b.xscale(b.end))
	    .attr("y2", 0)
	    ;
	// label
	l0.append("text")
	    .attr("class","blockLabel") ;
	// brush
	l0.append("g").attr("class","brush");

	//
	sblocks.exit().remove();

	// synteny block labels
	sblocks.select("text.blockLabel")
	    .text( b => b.chr )
	    .attr("x", b => (b.xscale(b.start) + b.xscale(b.end))/2 )
	    .attr("y", this.blockHeight / 2 + 10)
	    ;

	// brush
	sblocks.select("g.brush")
	    .attr("transform", b => `translate(0,${this.blockHeight / 2})`)
	    .each(function(b) {
		if (!b.brush) {
		    b.brush = d3.svg.brush()
			.on("brushstart", function(){ self.bbStart( b, this ); })
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
	let currFeat = current ? (current instanceof Feature ? current : current.__data__) : null;
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
	this.stacks = {}; // fid -> [ rects ] 
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
		  if (!self.stacks[k]) self.stacks[k] = []
		  self.stacks[k].push(this)
	      }
	      // 
	      d3.select(this)
		  .classed("highlight", hl)
		  .classed("current", hl && currFeat && this.__data__.id === currFeat.id)
		  .classed("extra", pulseCurrent && ff === currFeat)
	      return hl;
	  })
	  ;

	this.drawFiducials(currFeat);

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
    drawFiducials (currFeat) {
	// build data array for drawing fiducials between equivalent features
	let data = [];
	for (let k in this.stacks) {
	    // for each highlighted feature, sort the rectangles in its list by Y-coordinate
	    let rects = this.stacks[k];
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
	    let c1 = coordsAfterTransform(r[0]); // transform coords for 1st rect
	    let c2 = coordsAfterTransform(r[1]);  // transform coords for 2nd rect
	    r.tcoords = [c1,c2];
	    // four polygon points
	    let s = `${c1.x},${c1.y+c1.height} ${c2.x},${c2.y} ${c2.x+c2.width},${c2.y} ${c1.x+c1.width},${c1.y+c1.height}`
	    return s;
	})
	//
	// mousing over the fiducial highlights (as if the user had moused over the feature itself)
	.on("mouseover", (p) => {
	    this.highlight(p[0]);
	})
	.on("mouseout",  (p) => {
	    this.highlight();
	});
	// -------------------------------------
	// Draw feature labels. Each label is drawn once, above the first rectangle in its list.
	// The exception is the current (mouseover) feature, where the label is drawn above that feature.
	let labels = ffGrps.selectAll('text.featLabel')
	    .data(d => {
		let r = d.rects[0][0];
		if (currFeat && (d.fid === currFeat.ID || d.fid === currFeat.canonical)){
		    let r2 = r = d.rects.map( rr =>
		       rr[0].__data__ === currFeat ? rr[0] : rr[1]&&rr[1].__data__ === currFeat ? rr[1] : null
		       ).filter(x=>x)[0];
		    r = r2 ? r2 : r;
		}
	        return [{
		    fid: d.fid,
		    rect: r,
		    trect: coordsAfterTransform(r)
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

export { ZoomView };
