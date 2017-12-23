(function () {
 
let svgs = {
  "genomeView" : {
    selector : "#genomeView",
    margin : {top: 35, right: 10, bottom: 20, left: 30},
    outerWidth : 600,
    outerHeight : 250,
    width : -1,
    height : -1,
    svg : null
    },
  "zoomView" : {
    selector : "#zoomView",
    margin : {top: 35, right: 10, bottom: 20, left: 30},
    outerWidth : 800,
    outerHeight : 600,
    width : -1,
    height : -1,
    svg : null
    }
}

let allStrains = []; // list of all strain names
let strainData = {}; // map from strain name -> strain data obj
let rsName = null;      // reference strain name
let csNames = [];     // list of comparison strain names

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
            chromosomes : chrs,
            maxlen : maxlen,
            xscale : xs,
            yscale : ys,
            cscale : cs
        };
    });
}


function brushstart(c){
    clearBrushes(c.brush);
    d3.event.sourceEvent.stopPropagation();
}

function brushend(c){
    if(c.brush.empty()) return;
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
    // comparison strains
    let cs = d3.select("#compStrains");
    // cs.select(`option[value="${rsName}"]`).property('selected', true);
    let csos = cs[0][0].selectedOptions;
    csNames = [];
    for (let i = 0; i < csos.length; i++)
        csNames.push(csos[i].value); 
    //
    console.log("Ref strain=", rsName);
    console.log("Comparison strains", csNames);
    //
    drawGenomeView();
}

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

function drawZoomView(c, start, end){
    console.log("Draw zoom view.", c, start, end);
    let dataString = 'foo=bar';
    d3.xhr("./cgi-bin/test")
        .get(function(error, data){
            if (error) {
                console.log("error");
                console.log(error);
            }
            else { 
                console.log("succesfully called script");
                console.log(data);
            }
    });
    /*
    d3.xhr("./cgi-bin/test")
        .header("Content-Type", "application/x-www-form-url-encoded")
        .post(dataString,function(error, data){
            if (error) {
                console.log("error");
                console.log(error);
            }
            else { 
                console.log("succesfully called script");
                console.log(data);
            }
    });
    */
}


//
setup();

})();
