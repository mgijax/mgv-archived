import {d3json, d3tsv, overlaps, subtract} from './utils';
import {Feature} from './Feature';
import {FeaturePacker} from './FeaturePacker';
import {KeyStore} from './KeyStore';

//----------------------------------------------
// How the app loads feature data. Provides two calls:
// Requests features from the server and registers them in a cache.
// Interacts with the back end to load features.
//
class FeatureManager {
    constructor (app) {
        this.app = app;
	this.auxDataManager = this.app.queryManager.auxDataManager;
        this.id2feat = {};		// index from  feature ID to feature
	this.canonical2feats = {};	// index from canonical ID -> [ features tagged with that id ]
	this.symbol2feats = {}		// index from symbol -> [ features having that symbol ]
					// want case insensitive searches, so keys are lower cased
	this.cache = {};		// {genome.name -> {chr.name -> list of blocks}}
	this.mineFeatureCache = {};	// auxiliary info pulled from MouseMine 
	this.loadedGenomes = new Set(); // the set of Genomes that have been fully loaded
	//
	this.fStore = new KeyStore('features'); // maps genome name -> list of features
    }
 
    //----------------------------------------------
    processFeature (genome, d) {
	// If we've already got this one in the cache, return it.
	let f = this.id2feat[d.ID];
	if (f) return f;
	// Create a new Feature
	f = new Feature(d);
	f.genome = genome
	// index from transcript ID -> transcript
	f.tindex = {};
	// Register it.
	this.id2feat[f.ID] = f;
	// genome cache
	let gc = this.cache[genome.name] = (this.cache[genome.name] || {});
	// chromosome cache (w/in genome)
	let cc = gc[f.chr] = (gc[f.chr] || []);
	cc.push(f);
	//
	if (f.canonical && f.canonical !== '.') {
	    let lst = this.canonical2feats[f.canonical] = (this.canonical2feats[f.canonical] || []);
	    lst.push(f);
	}
	if (f.symbol && f.symbol !== '.') {
	    let s = f.symbol.toLowerCase();
	    let lst = this.symbol2feats[s] = (this.symbol2feats[s] || []);
	    lst.push(f);
	}
	// here y'go.
	return f;
    }
    //
    processExon (e) {
        // console.log("process exon: ", e);
	let feat = this.id2feat[e.gene.primaryIdentifier];
	let exon = {
	    ID: e.primaryIdentifier,
	    transcriptIDs: e.transcripts.map(t => t.primaryIdentifier),
	    chr: e.chromosome.primaryIdentifier,
	    start: e.chromosomeLocation.start,
	    end:   e.chromosomeLocation.end,
	    feature: feat
	};
	exon.transcriptIDs.forEach( tid => {
	    let t = feat.tindex[tid];
	    if (!t) {
	        t = { ID: tid, feature: feat, exons: [], start: Infinity, end: 0 };
		feat.transcripts.push(t);
		feat.tindex[tid] = t;
	    }
	    t.exons.push(exon);
	    t.start = Math.min(t.start, exon.start);
	    t.end = Math.max(t.end, exon.end);
	});
	feat.exons.push(exon);
    }

    //----------------------------------------------
    // Processes the "raw" features returned by the server.
    // Turns them into Feature objects and registers them.
    // If the same raw feature is registered again,
    // the Feature object created the first time is returned.
    // (I.e., registering the same feature multiple times is ok)
    //
    processFeatures (genome, feats) {
	return feats.map(d => this.processFeature(genome, d));
    }

    //----------------------------------------------
    ensureFeaturesByGenome (genome) {
	if (this.loadedGenomes.has(genome))
	    return Promise.resolve(true);
	return this.fStore.get(genome.name).then(data => {
	    if (data === undefined) {
		console.log("Requesting:", genome.name, );
		let url = `./data/genomedata/${genome.name}-features.tsv`;
		return d3tsv(url).then( rawfeats => {
		    rawfeats.sort( (a,b) => {
			if (a.chr < b.chr)
			    return -1;
			else if (a.chr > b.chr)
			    return 1;
			else
			    return a.start - b.start;
		    });
		    this.fStore.set(genome.name, rawfeats);
		    let feats = this.processFeatures(genome, rawfeats);
		});
	    }
	    else {
		console.log("Found in cache:", genome.name, );
		let feats = this.processFeatures(genome, data);
		return true;
	    }
	}).then( ()=> {
	    this.loadedGenomes.add(genome);  
	    this.app.showStatus(`Loaded: ${genome.name}`);
	    return true; 
	});
    }

    //----------------------------------------------
    // Returns a promise that resolves when all exons for the given set of gene ids.
    // Gene IDs are genome-specific, NOT canonical.
    //
    ensureExonsByGeneIds (ids) {
	// Map ids to Feature objects, filter for those where exons have not been retrieved yet
	// Exons accumulate in their features - no cache eviction implemented yet. FIXME.
	// 
	let feats = (ids||[]).map(i => this.id2feat[i]).filter(f => {
	    if (! f || f.exonsLoaded)
	        return false;
	    f.exonsLoaded = true;
	    return true;
	});
	if (feats.length === 0)
	    return Promise.resolve();
	return this.auxDataManager.exonsByGeneIds(feats.map(f=>f.ID)).then(exons => {
	    exons.forEach( e => { this.processExon(e); });
	});
    }

    /*
    //----------------------------------------------
    // Returns a promise that resolves to all exons for genes in the specified genome
    // that overlap the specified range.
    //
    ensureExonsByRange (genome, chr, start, end) {
	return this.auxDataManager.exonsByRange(genome,chr,start,end).then(exons => {
	    exons.forEach( e => {
	        this.processExon(e);
	    });
	});
    }
    */

    //----------------------------------------------
    loadGenomes (genomes) {
        return Promise.all(genomes.map(g => this.ensureFeaturesByGenome (g))).then(()=>true);
    }

    //----------------------------------------------
    getCachedFeaturesByRange (genome, range) {
        let gc = this.cache[genome.name] ;
	if (!gc) return [];
	let cFeats = gc[range.chr];
	if (!cFeats) return [];
	// FIXME: should be smarter than testing every feature!
	let feats = cFeats.filter(cf => overlaps(cf, range));
        return feats;	
    }

    //----------------------------------------------
    // Returns all cached features having the given canonical id.
    getCachedFeatureById (id) {
        return this.id2feats[id];
    }

    //----------------------------------------------
    // Returns all cached features having the given canonical id.
    getCachedFeaturesByCanonicalId (cid) {
        return this.canonical2feats[cid] || [];
    }

    //----------------------------------------------
    // Returns a list of features that match the given label, which can be an id, canonical id, or symbol.
    // If genome is specified, limit results to features from that genome.
    // 
    getCachedFeaturesByLabel (label, genome) {
	let f = this.id2feat[label]
	let feats = f ? [f] : this.canonical2feats[label] || this.symbol2feats[label.toLowerCase()] || [];
	return genome ? feats.filter(f=> f.genome === genome) : feats;
    }

    //----------------------------------------------
    // Returns a promise for the features in 
    // the specified ranges of the specified genome.
    getFeaturesByRange (genome, ranges, getExons) {
	let fids = []
	let p = this.ensureFeaturesByGenome(genome).then(() => {
            ranges.forEach( r => {
	        r.features = this.getCachedFeaturesByRange(genome, r) 
		r.genome = genome;
		fids = fids.concat(r.features.map(f => f.ID))
	    });
	    let results = { genome, blocks:ranges };
	    return results;
	});
	if (getExons) {
	    p = p.then(results => {
	        return this.ensureExonsByGeneIds(fids).then(()=>results);
		});
	}
	return p;
    }
    //----------------------------------------------
    // Returns a promise for the features having the specified ids from the specified genome.
    getFeaturesById (genome, ids, getExons) {
        return this.ensureFeaturesByGenome(genome).then( () => {
	    let feats = [];
	    let seen = new Set();
	    let addf = (f) => {
		if (f.genome !== genome) return;
		if (seen.has(f.id)) return;
		seen.add(f.id);
		feats.push(f);
	    };
	    let add = (f) => {
		if (Array.isArray(f)) 
		    f.forEach(ff => addf(ff));
		else
		    addf(f);
	    };
	    for (let i of ids){
		let f = this.canonical2feats[i] || this.id2feat[i];
		f && add(f);
	    }
	    if (getExons) {
	        return this.ensureExonsByGeneIds(feats.map(f=>f.ID)).then(()=>feats);
	    }
	    else
		return feats;
	});
    }
    //----------------------------------------------
    clearCachedData () {
	console.log("FeatureManager: Cache cleared.")
        return this.fStore.clear();
    }

} // end class Feature Manager

export { FeatureManager };
