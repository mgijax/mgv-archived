class Feature {
    constructor (genome, ID, gffObj) {
	this.genome = genome
	this.chr    = gffObj[0];
	this.start  = gffObj[3];
	this.end    = gffObj[4];
	this.strand = gffObj[6];
        this.type    = gffObj[2];
	let ga = gffObj[8];
        this.biotype = ga['biotype'];
	this.ID      = ID;
	this.canonical = ga['canonical_id'];
        this.symbol  = ga['canonical_symbol'];
	this.contig  = parseInt(ga['contig']);
	this.lane    = parseInt(ga['lane']);
	//
	this.exonsLoaded = false;
	this.exons = [];
	this.transcripts = [];
	// index from transcript ID -> transcript
	this.tindex = {};
    }
    //
    get length () {
        return this.end - this.start + 1;
    }
    //
    get id () {
        return this.canonical || this.ID;
    }
    //
    get label () {
        return this.symbol || this.ID;
    }
    //
    getMungedType () {
	return this.type === "gene" ?
	    this.biotype.indexOf('protein') >= 0 ?
		"protein_coding_gene"
		:
		this.biotype.indexOf("pseudogene") >= 0 ?
		    "pseudogene"
		    :
		    (this.biotype.indexOf("RNA") >= 0 || this.biotype.indexOf("antisense") >= 0) ?
			"ncRNA_gene"
			:
			this.biotype.indexOf("segment") >= 0 ?
			    "gene_segment"
			    :
			    "other_gene"
	    :
	    this.type === "pseudogene" ?
		"pseudogene"
		:
		this.type.indexOf("gene_segment") >= 0 ?
		    "gene_segment"
		    :
		    this.type.indexOf("RNA") >= 0 ?
			"ncRNA_gene"
			:
			this.type.indexOf("gene") >= 0 ?
			    "other_gene"
			    :
			    "other_feature_type";
    }
}

export { Feature };
