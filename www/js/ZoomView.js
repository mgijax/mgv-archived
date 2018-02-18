import { SVGView } from './SVGView';
import { Feature } from './Feature';
import { formatCoords } from './utils';

// ---------------------------------------------
class ZoomView extends SVGView {
    //
    constructor (app, elt, width, height, initialCoords, initialHi) {
      super(app, elt, width, height);
      //
      this.minSvgHeight = 250;
      this.blockHeight = 40;
      this.topOffset = 45;
      this.featHeight = 6;	// height of a rectangle representing a feature
      this.laneGap = 2;	        // space between swim lanes
      this.laneHeight = this.featHeight + this.laneGap;
      this.stripHeight = 70;    // height per genome in the zoom view
      this.stripGap = 20;	// space between strips
      //
      this.coords = initialCoords;// curr zoom view coords { chr, start, end }
      // IDs of Features we're highlighting. May be mgpid  or mgiId
      // hiFeats is an obj whose keys are the IDs
      this.hiFeats = (initialHi || []).reduce( (a,v) => { a[v]=v; return a; }, {} );
      this.svgMain.append("g")
        .attr("class","fiducials");
      this.svgMain.append("g")
        .attr("class","strips");
      this.cxtMenu = this.root.select('[name="cxtMenu"]');
      this.initDom();
    }
    //
    initDom () {
        let self = this;
	let r = this.root;
	let a = this.app;
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
	    tooltip: "Get SNPs from MGI for the current strains in the current region. (Some strains not available.)",
	    handler: ()=> this.app.linkToMgiSnpReport()
	},{
            label: "MGI JBrowse", 
	    icon: "open_in_new",
	    tooltip: "Open MGI JBrowse (C57BL/6J GRCm38) with the current coordinate range.",
	    handler: ()=> this.app.linkToMgiJBrowse()
	}]);
	//
	//
	let fSelect = function (f, shift, preserve) {
	    let id = f.mgiid || f.mgpid;
	    if (shift) {
		if (this.hiFeats[id])
		    delete this.hiFeats[id]
		else
		    this.hiFeats[id] = id;
	    }
	    else {
		if (!preserve) this.hiFeats = {};
		this.hiFeats[id] = id;
	    }
	}.bind(this);
	//
	let fMouseOverHandler = function(f) {
		if (d3.event.altKey) {
		    fSelect(f, d3.event.shiftKey, true);
		    if (this.timeout) window.clearTimeout(this.timeout);
		    this.timeout = window.setTimeout(function(){ this.app.callback(); }.bind(this), 1000);
		    this.highlight();
		}
		else if (!d3.event.ctrlKey)
		    this.highlight(f);
	}.bind(this);
	//
	let fMouseOutHandler = function(f) {
	    if (!d3.event.ctrlKey)
		this.highlight(); 
	}.bind(this);
	// Background click in zoom view = unselect all.
	this.svg
	  .on("click", () => {
	      let tgt = d3.select(d3.event.target);
	      let t = tgt[0][0];
	      if (t.tagName == "rect" && t.classList.contains("feature")) {
		  fSelect(t.__data__, d3.event.shiftKey);
		  this.highlight();
	          this.app.callback();
	      }
	      else {
		  if (t.tagName == "rect" && t.classList.contains("block") && !d3.event.shiftKey) {
		      this.hiFeats = {};
		      this.highlight();
		      this.app.callback();
		  }
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

	// Button: Menu in zoom view
	this.root.select(".menu > .button")
	  .on("click", function () {
	      // show context menu at mouse event coordinates
	      let cx = d3.event.clientX;
	      let cy = d3.event.clientY;
	      let bb = d3.select(this)[0][0].getBoundingClientRect();
	      self.showContextMenu(cx-bb.left,cy-bb.top);
	  });
	// zoom coordinates box
	this.root.select("#zoomCoords")
	    .call(zcs => zcs[0][0].value = formatCoords(this.coords))
	    .on("change", function () {
		let coords = parseCoords(this.value);
		if (! coords) {
		    alert("Please enter a coordinate range formatted as 'chr:start..end'. " +
		          "For example, '5:10000000..50000000'.");
		    this.value = "";
		    return;
		}
		self.app.setContext(coords);
	    });
	// zoom window size box
	this.root.select("#zoomWSize")
	    .on("change", function() {
	        let ws = parseInt(this.value);
		let c = self.coords;
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
			end: newe

		    });
		}
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
    update (coords) {
	let self = this;
	let c = this.coords = (coords || this.coords);
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
	        self.draw(data);
		mgv.showBusy(false);
            });
	});

    }

    //----------------------------------------------
    clearBrushes () {
	this.root.selectAll("g.brush")
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
	this.currentHLG = g;
	//
	this.svgMain.selectAll('.zoomStrip')
	    .classed("highlighted", d => d.genome === g);
	this.svgMain.selectAll('.zoomStripShadow')
	    .classed("highlighted", d => d.genome === g);
	this.app.showBlocks(g);
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
	let totalHeight = (this.stripHeight+this.stripGap)*(data.length+1)
	this.svg
	    .attr("height", Math.max(this.minSvgHeight, totalHeight));

	// y-coords for each genome in the zoom view
	data.forEach( (d,i) => d.genome.zoomY = this.topOffset + (i * (this.stripHeight+this.stripGap)) );
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

	// groups to hold the features, one per zoomBlock
	let fbs = zrFeats.selectAll(".zoomBlock")
	    .data(d => d.blocks, d => d.blockId);
	let newFbs = fbs.enter().append("g")
	    .attr("class", b => "zoomBlock" + (b.ori==="+" ? " plus" : " minus") + (b.chr !== b.fChr ? " translocation" : ""))
	    .attr("name", b=>b.blockId);
	//
	fbs.exit().remove();

	// groups to hold other stuff, one per zoomBlock
	let fids = zrFids.selectAll(".zoomBlock")
	    .data(d => d.blocks, d => d.blockId);
	let newFids = fids.enter().append("g")
	    .attr("class", b => "zoomBlock" + (b.ori==="+" ? " plus" : " minus") + (b.chr !== b.fChr ? " translocation" : ""))
	    .attr("name", b=>b.blockId);
	//
	fids.exit().remove();

	// rectangle for the whole block
	newFids.append("rect").attr("class", "block");
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
	    let fsx = this.xscale(b.fStart);
	    let x1 = i === 0 ? fsx : offset[j];
	    //let x1 = i === 0 ? fsx : Math.max(fsx, offset[j]);
	    let x2 = x1 + ppb * (b.end - b.start + 1)
	    let delta = 0; // a hook for adjusting range (for line-em-up function)
	    b.xscale = d3.scale.linear().domain([b.start, b.end]).range([x1+delta, x2+delta]);
	    offset[j] = x2+2;
	});

	// synteny block label
	fids.select("text.blockLabel")
	    .text( b => b.chr );

	// synteny rect
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
	let newFeats = feats.enter().append("rect")
	    .attr("class", f => "feature" + (f.strand==="-" ? " minus" : " plus"))
	    .attr("name", f => f.mgpid)
	    .style("fill", f => self.app.cscale(f.getMungedType()))
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
		  .classed("current", hl && currFeat && this.__data__.id === currFeat.id)
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
	// FIXME: reachover
	this.app.featureDetails.update(currFeat);
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
	let self = this;
	//
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
	})
	// mousing over the fiducial highlights (as if the user had moused over the feature itself)
	.on("mouseover", (p) => {
	    if (!d3.event.ctrlKey)
	        this.highlight(p[0]);
	})
	.on("mouseout",  (p) => {
	    if (!d3.event.ctrlKey)
	        this.highlight();
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

export { ZoomView };
