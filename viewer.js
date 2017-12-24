(function () {
 
let svgs = {
  genomeView : {
    selector : "#genomeView svg",
    margin : {top: 35, right: 10, bottom: 20, left: 10},
    outerWidth : 600,
    outerHeight : 250,
    width : -1,
    height : -1,
    svg : null
    },
  zoomView : {
    selector : "#zoomView svg",
    margin : {top: 10, right: 10, bottom: 10, left: 10},
    outerWidth : 800,
    outerHeight : 200,
    width : -1,
    height : -1,
    svg : null,
    strains : [] // strains in zoom view, top-to-bottom order
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
//   url (string) The url of the json resource
// Returns:
//   a promise that resolves to the json object value, or rejects with an error
function d3tsv(url) {
    return new Promise(function(resolve, reject) {
        d3.tsv(url, function(error, tsv){
            error ? reject({ status: error.status, statusText: error.statusText}) : resolve(tsv);
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
    d3tsv("./data/strainlist.tsv").then(function(data){
        allStrains = data.map(s => s.strain);
        initOptList("#refStrain", allStrains);
        initOptList("#compStrains", allStrains, null, null, true);
        //
        return Promise.all(allStrains.map(s => d3tsv(`./data/${s}-chromosomes.tsv`)));
    })
    .then(function (data) {
        processChromosomes(data);
        go();
    })
    .catch(function(error) {
        console.log("ERROR!", error)
    });

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

	chrs.forEach(function(c){
	    var sc = d3.scale.linear().domain([1,c.length]).range([0, ys(c.length)]);
            c.brush = d3.svg.brush().y(sc)
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


function brushstart(c){
    clearBrushes(c.brush);
    d3.event.sourceEvent.stopPropagation();
    brushChr = c;
}

function brushend(c){
    if(c.brush.empty()) {
	brushChr = null;
	return;
    }
    var xtnt = c.brush.extent();
    drawZoomView(c, Math.floor(xtnt[0]), Math.ceil(xtnt[1]))
}

function clearBrushes(except){
    d3.selectAll('.brush').each(function(c){
        if (c.brush !== except) {
            c.brush.clear();
            c.brush(d3.select(this));
        }
    });
}
//----------------------------------------------
//
function go() {
    console.log("GO!");
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
    console.log("Ref strain=", rsName);
    console.log("Comparison strains", csNames);
    //
    drawGenomeView();
    if (brushChr) brushend(brushChr);
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
    brushes.enter().append('g').attr('class','brush')
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

//----------------------------------------------
function drawZoomView(c, start, end){

    console.log("Draw zoom view");

    // Get the features in the brush region, then draw them
    let dataString = `strain=${rsName}&chr=${c.name}&start=${start}&end=${end}`
    let url = "./bin/getFeatures.cgi?" + dataString;
    d3.json(url, function(data) {
        drawZoomFeatures(processFeatures(data), rStrain, c, start, end);
    });

    //
    let v = svgs.zoomView;

    // construct data array. First el is the ref strain. Following are any comparison
    // strains. Remove rStrain from cStrains, if present (avoid dup).
    let strains = [].concat(cStrains)
    let ri = strains.lastIndexOf(rStrain)
    if (ri >= 0) strains.splice(ri,1)
    //
    v.strains = [rStrain].concat(strains);
    // zoom regions
    let zrs = v.svg
              .selectAll("g.zoomRegion")
              .data(v.strains, d => d.name);
    let newZrs = zrs.enter()
        .append("svg:g")
            .attr("class", "zoomRegion")
	    .attr("name", s => s.name);
    zrs.exit().remove();
    //
    let dy = v.height / (v.strains.length + 1);
    v.strains.forEach( (s,i) => s.zoomY = (i + 1) * dy );
    //
    newZrs.append("g")
        .attr("class", "features");
    // lines
    newZrs.append("line") ;
    zrs.select("line")
	.attr("x1", 0)
	.attr("y1", d => d.zoomY )
	.attr("x2", v.width)
	.attr("y2", d => d.zoomY )
    // strain labels
    newZrs.append("text") ;
    zrs.select("text")
	.attr("x", 0)
	.attr("y", d => d.zoomY + 10)
	.attr("font-family","sans-serif")
	.attr("font-size", 10)
        .text(s =>s .name);

}

function drawZoomFeatures(feats, strain, c, start, end){
    console.log("Draw zoom features", feats)

    let v = svgs.zoomView;

    let xscale = d3.scale.linear()
        .domain([start,end])
	.range([0,v.width]);

    let rects = v.svg.select(`g.zoomRegion[name="${strain.name}"] .features`)
      .selectAll('rect.feature')
      .data(feats, f => f.mgpid);
    rects.exit().remove();
    //
    let newRs = rects.enter()
      .append("rect")
        .attr("class","feature");
    //
    let rHeight = 20;
    rects
      .attr("x", f => xscale(f.start))
      .attr("y", strain.zoomY - rHeight/2)
      .attr("width", f => xscale(f.end)-xscale(f.start)+1)
      .attr("height", rHeight);
}

//----------------------------------------------
function processFeatures (data) {
    return data.map(d => {
        return {
	  chr     : d[0],
	  start   : parseInt(d[1]),
	  end	  : parseInt(d[2]),
	  strand  : d[3],
	  type    : d[4],
	  biotype : d[5],
	  mgpid   : d[6],
	  mgiid   : d[7],
	  symbol  : d[8],
	};
    });
}


//----------------------------------------------

setup();

//----------------------------------------------
})();
