import { SVGView } from './SVGView';
import { coordsAfterTransform } from './utils';

// ---------------------------------------------
class GenomeView extends SVGView {
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
	     .attr('width',10)
	     .attr('x', -5)
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
    drawTicks (features) {
	this.currTicks = features;
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
	    .data(d => d.features, d => d.mgpid);
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

export { GenomeView };
