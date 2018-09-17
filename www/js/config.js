export default {
    MGVApp : {
	name :	"Multiple Genome Viewer (MGV)",
	version :	"1.0.0", // use semantic versioning
    },
    AuxDataManager : {
	mousemine : 'test',
	allMines : {
	    'dev' : 'http://bhmgimm-dev:8080/mousemine',
	    'test': 'http://test.mousemine.org/mousemine',
	    'public' : 'http://www.mousemine.org/mousemine',
	}
    },
    SVGView : {
	outerWidth : 100,
	width : 100,
	outerHeight : 100,
	height : 100,
	margins : {top: 18, right: 12, bottom: 12, left: 12}
    },
    ZoomView : {
	topOffset : 20,		// Y offset to first strip (should = stripGap, so technically redundant)
	featHeight : 8,		// height of a rectangle representing a feature
	laneGap : 2,	        // space between swim lanes
	laneHeight : 10,	// == featHeight + laneGap
	laneGapMinor : 2,	// space between minor lanes (between transcripts)
	laneHeightMinor : 10,	// == featHeight + laneGapMinor
	minLanes : 3,		// minimum number of swim lanes (each strand)
	blockHeight : 60,	// == 2 * minLanes * laneHeight
	minStripHeight : 75,    // height per genome in the zoom view
	stripGap : 20,	// space between strips
	maxSBgap : 20,	// max gap allowed between blocks.
	dmode : 'comparison',// initial drawing mode. 'comparison' or 'reference'
	wheelThreshold : 3,	// minimum wheel distance 
	featureDetailThreshold : 2000000, // if width <= thresh, draw feature details.
	wheelContextDelay : 300,  // ms delay after last wheel event before changing context
    },
    QueryManager : {
	searchTypes : [{
	    method: "featuresByPhenotype",
	    label: "...by phenotype or disease",
	    template: "",
	    placeholder: "Pheno/disease (MP/DO) term or IDs"
	},{
	    method: "featuresByFunction",
	    label: "...by cellular function",
	    template: "",
	    placeholder: "Gene Ontology (GO) terms or IDs"
	},{
	    method: "featuresByPathway",
	    label: "...by pathway",
	    template: "",
	    placeholder: "Reactome pathways names, IDs"
	},{
	    method: "featuresById",
	    label: "...by symbol/ID",
	    template: "",
	    placeholder: "MGI names, synonyms, etc."
	}]
    }
};
