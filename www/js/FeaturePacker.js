import { overlaps } from './utils';

// Given a set of features (actually, anything with start/end coordinates),
// assigns y coordinates so that the rectangles do not overlap.
// Uses screen coordinates, ie, up is -y. 
// Packs rectangles on a horizontal baseline at y=0.
//    
// Usage:
//
//     new FeaturePacker('lane', 'start', 'end', 1, 0).pack(myRectangles, true);
//     new FeaturePacker('y', 'start', 'end', f=>f.transcripts.length, 10).pack(myRectangles, true);
//
class FeaturePacker {
    // Args:
    //   yAttr (string) The name of the y attribute to assign to each feature
    //   sAttr (string or number or function) Specifies start position for each feature
    //   eAttr (string or number or function) Specifies end position for each feature
    //   hAttr (string or number or function) Specifies the height for each feature.
    //   	A string specifies an existing attribute; a number specifies a constant;
    //   	a function specifies a method for computing the height given a feature.
    //   yGap (number) min vert  distance between overlapping features.
    constructor (yAttr, sAttr, eAttr, hAttr, yGap) {
	this.yAttr = yAttr;
	this.sFcn = this.funcify(sAttr)
	this.eFcn = this.funcify(eAttr)
	this.hFcn = this.funcify(hAttr);
	this.yGap = yGap;
	//
        this.buffer = null;
    }
    // Turns its argument into an accessor function and returns the function.
    funcify (v) {
	switch (typeof(v)) {
	case 'function':
	    return v;
	case 'string':
	    return x => x[v];
	default:
	    return x => v;
	}
    }
    assignNext (f) {
	let minGap = this.hFcn(f) + 2*this.yGap;
	let y = 0;
	let i = 0;
	let sf = this.sFcn(f);
	let ef = this.eFcn(f);
	// remove anything that does not overlap the new feature
        this.buffer = this.buffer.filter(ff => {
	    let sff = this.sFcn(ff);
	    let eff = this.eFcn(ff);
	    return sf <= eff && ef >= sff;
	});
	// Look for a big enough gap in the y dimension between existing blocks
	// to fit this new one. If none found, stack on top.
	// Buffer is maintained in reverse y sort order.
	for (i in this.buffer) {
	    let ff = this.buffer[i];
	    let gapSize = y - (ff[this.yAttr] + this.hFcn(ff));
	    if (gapSize >= minGap) {
		break;
	    }
	    y = ff[this.yAttr];
	};
	f[this.yAttr] = y - this.hFcn(f) - this.yGap;
	this.buffer.splice(i,0,f);
    }
    //
    // Packs features by assigning y coordinates.
    // Args:
    //   feats	(list) the Features to pack
    //   sort	(boolean)
    // Returns:
    //   nothing. features are updated by assigning a y coordinate 
    pack (feats, sort) {
        this.buffer = [];
        if (sort) feats.sort((a,b) => this.sFcn(a) - this.sFcn(b));
	feats.forEach(f => this.assignNext(f));
	this.buffer = null;
    }
}

export { FeaturePacker };
