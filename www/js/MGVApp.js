import { parseCoords, formatCoords, d3tsv, initOptList, same } from './utils';
import { Genome }          from './Genome';
import { FeatureManager }  from './FeatureManager';
import { QueryManager }    from './QueryManager';
import { ListManager }     from './ListManager';
import { ListEditor }      from './ListEditor';
import { FacetManager }    from './FacetManager';
import { BTManager }       from './BTManager';
import { GenomeView }      from './GenomeView';
import { ZoomView }        from './ZoomView';

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
	this.genomeView = new GenomeView(this, "#genomeView", 800, 250, this);
	this.zoomView   = new ZoomView  (this, "#zoomView", 800, 250, this);
	this.cscale = d3.scale.category10().domain([
	    "protein_coding_gene",
	    "pseudogene",
	    "ncRNA_gene",
	    "gene_segment",
	    "other_gene",
	    "other_feature_type"
	]);
	//
	d3.selectAll(".collapsible")
	    .append("i")
	    .attr("class","material-icons button collapse")
	    .on("click.default", function () {
		let p = d3.select(this.parentNode);
		p.classed("closed", ! p.classed("closed"));
	    });
	//
	d3.select("#featureDetails .button.collapse")
	    .on("click.extra", () => this.updateFeatureDetails());

	// 
	d3.selectAll(".pagebox")
	    .append("i")
	    .attr("class","material-icons busy rotating")
	    ;
	//
	this.listManager    = new ListManager(this, "#mylists");
	this.listManager.update();
	//
	this.listEditor = new ListEditor(this, '#listeditor');
	//
	this.translator     = new BTManager(this);
	this.featureManager = new FeatureManager(this);
	//
	let searchTypes = [{
	    method: "featuresById",
	    label: "...by symbol/ID",
	    template: "",
	    placeholder: "MGI symbols/IDs"
	},{
	    method: "featuresByFunction",
	    label: "...by cellular function",
	    template: "",
	    placeholder: "Gene Ontology (GO) terms/IDs"
	},{
	    method: "featuresByPhenotype",
	    label: "...by mutant phenotype",
	    template: "",
	    placeholder: "Mammalian Phenotype (MP) terms/IDs"
	},{
	    method: "featuresByDisease",
	    label: "...by disease implication",
	    template: "",
	    placeholder: "Disease Ontology (DO) terms/IDs"
	}];
	this.queryManager = new QueryManager(this, "#findgenes", searchTypes);
	//

	// Button: Gear icon to show/hide left column
	d3.select("#header > .gear.button")
	    .on("click", () => {
	        let lc = d3.select("#mgv > .leftcolumn");
		lc.classed("closed", () => ! lc.classed("closed"));
		this.resize()
	    });
	
	// Create context menu. Only one command so far...
	this.zoomView.initContextMenu([{
            label: "MGI SNPs", 
	    icon: "open_in_new",
	    tooltip: "Get SNPs from MGI for the current strains in the current region. (Some strains not available.)",
	    handler: ()=> this.linkToMgiSnpReport()
	}]);
	//
	// -------------------------------------------------------------------
	// Facets
	// -------------------------------------------------------------------
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
		    alert("Please enter a coordinate range formatted as 'chr:start..end'. " +
		          "For example, '5:10000000..50000000'.");
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

	// initial highlighted features 
	(cfg.highlight || []).forEach(h => this.zoomView.hiFeats[h]=h);

	// ------------------------------
	// ------------------------------

	// Things are all wired up. Now let's get some data.
	// Start with the file of all the genomes.
	d3tsv("./data/genomeList.tsv").then(function(data){
	    // create Genome objects from the raw data.
	    this.allGenomes   = data.map(g => new Genome(g));
	    this.allGenomes.sort( (a,b) => {
	        return a.label < b.label ? -1 : a.label > b.label ? +1 : 0;
	    });
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
	    d3.select("#compGenomes").on("change", () => {
	        this.draw(); 
		if (this.cGenomes.length === 1)
		    this.showBlocks(this.cGenomes[0]);
	    });
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
	    ["Genome"     ,9],
	    ["MGP id"     ,17],
	    ["Type"       ,10.5],
	    ["BioType"    ,18.5],
	    ["Coords"     ,18],
	    ["Length"     ,7],
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
    get currentList () {
        return this.currList;
    }
    set currentList (lst) {
    	//
	this.currList = lst;
	//
	let lists = d3.select('#mylists').selectAll('.listInfo');
	lists.classed("current", d => d === lst);
	if (lst) {
	    // make this list the current selection in the zoom view
	    this.zoomView.hiFeats = lst.ids.reduce((a,v) => { a[v]=v; return a; }, {})
	    this.zoomView.update();
	    // show this list as tick marks in the genome view
	    this.featureManager.getFeaturesById(this.rGenome, lst.ids)
		.then( feats => {
		    this.genomeView.drawTicks(feats);
		    this.genomeView.drawTitle();
		});
	}
	else {
	    this.zoomView.hiFeats = {};
	    this.zoomView.update();
	    //
	    this.genomeView.drawTicks([]);
	    this.genomeView.drawTitle();
	}
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

export { MGVApp };
