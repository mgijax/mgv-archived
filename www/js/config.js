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
    ZoomView : {
	blockHeight : 60,
	topOffset : 15,
	featHeight : 8,	// height of a rectangle representing a feature
	laneGap : 2,	        // space between swim lanes
	// laneHeight : this.featHeight + this.laneGap,
	minStripHeight : 75,    // height per genome in the zoom view
	stripGap : 20,	// space between strips
	maxSBgap : 20,	// max gap allowed between blocks.
	dmode : 'comparison',// initial drawing mode. 'comparison' or 'reference'
	wheelThreshold : 3,	// minimum wheel distance 
	featureDetailThreshold : 2000000, // if width <= thresh, draw feature details.
    }
};
