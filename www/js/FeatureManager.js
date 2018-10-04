import {d3json, d3tsv, overlaps, subtract} from './utils';
import {Feature} from './Feature';
import {KeyStore} from './KeyStore';
import config from './config';
import { ContigAssigner, SwimLaneAssigner, FeaturePacker } from './Layout';

//----------------------------------------------
// How the app loads feature data. Provides two calls:
// Requests features from the server and registers them in a cache.
// Interacts with the back end to load features.
//
class FeatureManager {
    constructor (app) {
	this.cfg = config.FeatureManager;
        this.app = app;
	this.auxDataManager = this.app.queryManager.auxDataManager;
        this.id2feat = {};		// index from  feature ID to feature
	this.canonical2feats = {};	// index from canonical ID -> [ features tagged with that id ]
	this.symbol2feats = {}		// index from symbol -> [ features having that symbol ]
					// want case insensitive searches, so keys are lower cased
	this.cache = {};		// {genome.name -> {chr.name -> list of blocks}}
	this.mineFeatureCache = {};	// auxiliary info pulled from MouseMine 
	this.loadedGenomes = new Set(); // the set of Genomes that have been fully loaded
	this.transcriptFiles = {};	// map from file name to promise for that file.
	//
	this.fStore = new KeyStore('features'); // maps genome name -> list of features
    }
 
    //----------------------------------------------
    // Args:
    //   d (parsed GFF row)
    processFeature (genome, d) {
	let ID = d[8]['ID'];
	// If we've already got this one in the cache, return it.
	let f = ID ? this.id2feat[ID] : null;
	if (f) return f;
	// Create a new Feature
	f = new Feature(genome, ID, d);
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
    //---------------------------------------------
    assertSorted (feats) {
	let prev = null;
        feats.forEach((f,i) => {
	    if (prev && f.chr !== prev.chr)
	        prev = null;
	    if (prev && f.start < prev.start)
	        throw 'Features are not sorted at position ' + i;
	    prev = f;
	});
    }
    //----------------------------------------------
    // Processes the "raw" features returned by the server.
    // Turns them into Feature objects and registers them.
    // If the same raw feature is registered again,
    // the Feature object created the first time is returned.
    // (I.e., registering the same feature multiple times is ok)
    //
    processFeatures (genome, feats) {
	let cta;	// contig assigner
	let swa_p;	// swim lane assigner for plus strand
	let swa_m;	// swim lane assigner for minus strand
	let fp;		// feature packer
	let prev;	// previous feature
	// turn raw features into Feature objects
	feats = feats.map(d => this.processFeature(genome, d));
	// assign lanes
	feats.forEach(f => {
	    if (f.chr != prev) {
	        cta = new ContigAssigner();
		swa_p = new SwimLaneAssigner();
		swa_m = new SwimLaneAssigner();
		fp = new FeaturePacker(1);
	    }
	    f.contig = cta.assignNext(f.start, f.end);
	    f.lane = f.strand === '+' ? 
	        swa_p.assignNext(f.start, f.end)
		:
		-swa_m.assignNext(f.start, f.end);
	    f.lane2 = fp.assignNext(f.start, f.end, Math.max(1, f.transcript_count), f.symbol)
	    prev = f.chr;
	});
	//this.assertSorted(feats);
	return feats;
    }

    //----------------------------------------------
    ensureFeaturesByGenome (genome) {
	if (this.loadedGenomes.has(genome))
	    return Promise.resolve(true);
	return this.fStore.get(genome.name).then(data => {
	    if (data === undefined) {
		console.log("Requesting:", genome.name, );
		let url = `./data/${genome.name}/features.json`;
		return d3json(url).then( rawfeats => {
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
    processTranscript (t) {
	let gid = t[8]['gene_id'];
	let feat = this.id2feat[gid];
	let tt = {
	    ID: t[8]['ID'],
	    chr: t[0],
	    start: t[3],
	    end: t[4],
	    strand: t[6],
	    feature: feat,
	}
	tt.exons = t[8]['eOffsets'].map( (o,i) => {
	    let start = t[3] + o;
	    let end = start + t[8]['eLengths'][i] - 1;
	    return {ID:'?', start:start, end:end, feature:feat}
	});
	feat.transcripts.push(tt);
    }

    //----------------------------------------------
    loadTranscriptFile (feat) {
	let genome = feat.genome.name;
	let chr = feat.chr;
	let blk = Math.floor(feat.start/this.cfg.transcriptBlockSize);
	let url = `data/${genome}/transcripts/chr${chr}.${blk}.json`;
	let p = this.transcriptFiles[url];
	if (!p) {
	    p = this.transcriptFiles[url] = d3json(url).then(transcripts => {
		transcripts.forEach(t => this.processTranscript(t));
		console.log('Loaded transcripts: ' + url);
	    });
	}
	return p;
    }

    //----------------------------------------------
    // Returns a promise that resolves when all exons for the given set of gene ids.
    // Gene IDs are genome-specific, NOT canonical.
    //
    ensureTranscriptsByGeneIds (ids) {
	// Map ids to Feature objects, filter for those where exons have not been retrieved yet
	// Exons accumulate in their features - no cache eviction implemented yet. FIXME.
	// 
	let feats = (ids||[]).map(i => this.id2feat[i]).filter(f => f);
	let promises = feats.map(f => {
	    let genome = f.genome.name;
	    let chr = f.chr;
	    let blk = Math.floor(f.start/this.cfg.transcriptBlockSize);
	    let url = `data/${genome}/transcripts/chr${chr}.${blk}.json`;
	    let p = this.transcriptFiles[url];
	    if (!p) {
	        p = this.transcriptFiles[url] = d3json(url).then(transcripts => {
		    transcripts.forEach(t => this.processTranscript(t));
		    console.log('Loaded transcripts: ' + url);
		});
	    }
	    return p;
	})
	return Promise.all(promises);
    }

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
	        return this.ensureTranscriptsByGeneIds(fids).then(()=>results);
		});
	}
	return p;
    }
    //----------------------------------------------
    // Returns a promise for the features having the specified ids from the specified genome.
    getFeaturesById (genome, ids) {
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
