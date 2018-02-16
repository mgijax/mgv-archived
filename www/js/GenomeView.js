import { SVGView } from './SVGView';

// ---------------------------------------------
class GenomeView extends SVGView {
    constructor (app, elt, width, height) {
        super(app, elt, width, height);
	this.cwidth = 20;        // chromosome width
	this.brushChr = null;	 // which chr has the current brush
	this.bwidth = this.cwidth/2;  // block width
	this.currBlocks = null;
	this.currTicks = null;
	//
	this.gSticks  = this.svgMain.append('g').attr("name", "backbones");
	this.gBlocks  = this.svgMain.append('g').attr("name", "synBlocks");
	this.gTicks   = this.svgMain.append('g').attr("name", "ticks");
	this.gLabels  = this.svgMain.append('g').attr("name", "labels");
	this.gBrushes = this.svgMain.append('g').attr("name", "brushes");
	this.title    = this.svgMain.append('text').attr("class", "title");
    }
    setBrushCoords (coords) {
	this.clearBrushes();
	this.gBrushes
	  .select(`g.brush[name="${ coords.chr }"]`)
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
	this.gBrushes.selectAll('.brush').each(function(chr){
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

	// Chromosome backbones (lines)
	let xf = function(d){return self.bwidth+gdata.xscale(d.name);};
	let ccels = this.gSticks.selectAll('line.chr')
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
	let labels = this.gLabels.selectAll('.chrlabel')
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

	// Brushes last so they overlay everything
	let brushes = this.gBrushes.selectAll("g.brush")
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
	let lines = [`${refg}${(blockg || lst) ? ', showing' : ''}`];
	blockg && lines.push(`- synteny blocks vs ${blockg}`);
	lst && lines.push(`- list "${lst}"`);
	this.drawText( this.width/2, this.height-30, lines, ["title", "subtitle"] );
    }
    // ---------------------------------------------
    // Draws the outlines of synteny blocks of the ref genome vs.
    // the given genome.
    // Passing null erases all synteny blocks.
    // Args:
    //    blockData == { ref:Genome, comp:Genome, blocks: list of synteny blocks }
    //    Each sblock === { blockId:int, ori:+/-, fromChr, fromStart, fromEnd, toChr, toStart, toEnd }
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
	    .attr("x", b => this.getX(b.fromChr) + bwidth/2 )
	    .attr("y", b => this.getY(b.fromStart))
	    .attr("width", bwidth)
	    .attr("height", b => Math.max(0,this.getY(b.fromEnd - b.fromStart + 1)))
	    .classed("inversion", b => b.ori === "-")
	    .classed("translocation", b => b.fromChr !== b.toChr)
	    ;

	this.drawTitle();
    }

    // ---------------------------------------------
    drawTicks (features) {
	this.currTicks = features;
	let gdata = this.app.rGenome;
	// feature tick marks
	let tickLength = 10;
	if (!features || features.length === 0) {
	    this.gTicks.selectAll(".feature").remove();
	    return;
	}
	// the tick elements
        let feats = this.gTicks.selectAll(".feature")
	    .data(features, d => d.mgpid);
	//
	let xAdj = f => (f.strand === "+" ? tickLength : -tickLength);
	//
	let shape = "circle";  // "circle" or "line"
	//
	feats.enter()
	    .append(shape)
	    .attr("class","feature")
	    .append("title")
	    .text(f=>f.symbol || f.id);
	if (shape === "line") {
	    feats.attr("x1", f => gdata.xscale(f.chr) + xAdj(f) + 5)
	    feats.attr("y1", f => gdata.yscale(f.start))
	    feats.attr("x2", f => gdata.xscale(f.chr) + xAdj(f) + tickLength + 5)
	    feats.attr("y2", f => gdata.yscale(f.start))
	}
	else {
	    feats.attr("cx", f => gdata.xscale(f.chr) + xAdj(f) + 10)
	    feats.attr("cy", f => gdata.yscale(f.start))
	    feats.attr("r",  tickLength / 2);
	}
	//
	feats.exit().remove()
    }

} // end class GenomeView

export { GenomeView };
