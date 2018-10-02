
class ContigAssigner {
    constructor () {
        this.contig = 0;
	this.hwm = null;
    }
    assignNext (fstart, fend) {
        if (this.hwm === null || fstart > this.hwm)
	    this.contig += 1;
	this.hwm = Math.max(this.hwm, fend);
	return this.contig;
    }
}

class SwimLaneAssigner {
    constructor () {
        this.lanes = [];
    }
    assignNext (fstart, fend) {
        for (let i = 0; i < this.lanes.length; i++) {
	    let hwm = this.lanes[i];
	    if (fstart > hwm) {
	        this.lanes[i] = fend;
		return i+1;
	    }
	}
	this.lanes.push(fend);
	return this.lanes.length;
    }
}

class xFeaturePacker {
    constructor (ygap) {
	// distance between blocks.
	this.ygap = ygap || 0;
	// overlapping features.
        this.buffer = [];
    }
    assignNext (fstart, fend, fheight) {
	// remove buffer items that do not overlap the new feature
        this.buffer = this.buffer.filter(ff => {
	    return fstart <= ff.fend && fend >= ff.fstart;
	});
	// Look for a big enough gap in the y dimension between buffer items
	// to fit this new one. If none found, stack on top.
	// Buffer is maintained in sorted y order.
	// NB: remember, up means negative y direction.
	let minGap = fheight + 2*this.ygap;
	let y = 0;
	let i = 0;
	for (i in this.buffer) {
	    let ff = this.buffer[i];
	    // distance between current y and bottom of next block in buffer
	    let gapSize = y - (ff.y + ff.fheight);
	    if (gapSize >= minGap) {
		break;
	    }
	    // set current y to top of this buffer block
	    y = ff.y;
	};
	// Found y for new block's baseline. Want position at top of block.
	y = y - fheight - this.ygap;
	// Insert into buffer. Maintain y sort.
	this.buffer.splice(i,0, {fstart, fend, fheight, y});
	// here ya go
	return y;
    }
}
class FeaturePacker {
    constructor (ygap) {
	// distance between blocks.
	this.ygap = ygap || 0;
	// overlapping features.
        this.buffer = [];
    }
    assignNext (fstart, fend, fheight) {
	// remove buffer items that do not overlap the new feature
        this.buffer = this.buffer.filter(ff => {
	    return fstart <= ff.fend && fend >= ff.fstart;
	});
	// Look for a big enough gap in the y dimension between buffer items
	// to fit this new one. If none found, stack on top.
	// Buffer is maintained in sorted y order.
	// NB: remember, positive y is down in screen coords
	let minGap = fheight + 2*this.ygap;
	let y = 0; // start off at baseline
	let i = 0;
	for (i in this.buffer) {
	    let ff = this.buffer[i];
	    // distance between current y and top of next block in buffer
	    let gapSize = ff.y - y;
	    if (gapSize >= minGap) {
		break;
	    }
	    // set current y to bottom of this buffer block
	    y = ff.y + ff.fheight;
	};
	// Found y for new block's baseline. Want position at top of block.
	y += this.ygap;
	// Insert into buffer. Maintain y sort.
	this.buffer.splice(i,0, {fstart, fend, fheight, y});
	// here ya go
	return y;
    }
}

export { ContigAssigner, SwimLaneAssigner, FeaturePacker };
